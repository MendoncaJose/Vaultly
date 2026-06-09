import cron from 'node-cron'
import { prisma } from '../../lib/prisma'
import { getQuote } from '../market-data/market-data.service'
import { env } from '../../config/env'

async function checkAlerts() {
  console.log(`[alert-cron] running at ${new Date().toISOString()}`)

  const activeAlerts = await prisma.alert.findMany({
    where: { isActive: true, triggeredAt: null },
    include: { asset: { select: { symbol: true, type: true } } },
  })

  if (activeAlerts.length === 0) return

  // Deduplicate symbols
  const symbolMap = new Map(activeAlerts.map((a) => [a.asset.symbol, a.asset.type]))

  const quoteMap = new Map<string, number>()
  await Promise.allSettled(
    [...symbolMap.entries()].map(async ([symbol, assetType]) => {
      try {
        const result = await getQuote(symbol, assetType)
        quoteMap.set(symbol, result.quote.price)
        if (result.quote.changePercent !== undefined) {
          quoteMap.set(`${symbol}:changePercent`, result.quote.changePercent)
        }
      } catch {
        // skip — no quote available
      }
    }),
  )

  for (const alert of activeAlerts) {
    const symbol = alert.asset.symbol
    const price = quoteMap.get(symbol)
    if (price == null) continue

    const target = Number(alert.targetValue)
    let triggered = false

    if (alert.type === 'PRICE_ABOVE' && price > target) triggered = true
    if (alert.type === 'PRICE_BELOW' && price < target) triggered = true
    if (alert.type === 'DAILY_CHANGE_PERCENT') {
      const changePercent = quoteMap.get(`${symbol}:changePercent`) ?? 0
      if (Math.abs(changePercent) >= target) triggered = true
    }

    if (!triggered) continue

    await prisma.$transaction([
      prisma.alert.update({
        where: { id: alert.id },
        data: { triggeredAt: new Date(), isActive: false },
      }),
      prisma.notification.create({
        data: {
          userId: alert.userId,
          alertId: alert.id,
          type: 'ALERT_TRIGGERED',
          title: `Alert triggered: ${symbol}`,
          message: buildMessage(alert.type, symbol, price, target),
        },
      }),
    ])
  }

  console.log(`[alert-cron] done — checked ${activeAlerts.length} alerts`)
}

function buildMessage(type: string, symbol: string, price: number, target: number): string {
  if (type === 'PRICE_ABOVE') return `${symbol} is now $${price.toFixed(2)}, above your target of $${target}`
  if (type === 'PRICE_BELOW') return `${symbol} is now $${price.toFixed(2)}, below your target of $${target}`
  return `${symbol} daily change has exceeded ${target}% (current price: $${price.toFixed(2)})`
}

export function startAlertCron() {
  const schedule = env.ALERT_CRON_SCHEDULE
  const timezone = env.ALERT_CRON_TIMEZONE

  cron.schedule(schedule, checkAlerts, { timezone })
  console.log(`[alert-cron] scheduled — ${schedule} (${timezone})`)
}
