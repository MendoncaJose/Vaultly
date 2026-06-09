import { app } from './app'
import { env } from './config/env'
import { startAlertCron } from './modules/alerts/alert.cron'

app.listen(env.PORT, () => {
  console.log(`[server] running on port ${env.PORT}`)
  startAlertCron()
})
