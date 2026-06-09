import { prisma } from '../../lib/prisma'

export async function listNotifications(userId: string) {
  return prisma.notification.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })
}

export async function markAsRead(userId: string, notificationId: string) {
  const notification = await prisma.notification.findUnique({ where: { id: notificationId } })
  if (!notification || notification.userId !== userId) {
    throw Object.assign(new Error('Notification not found'), { status: 404 })
  }
  return prisma.notification.update({
    where: { id: notificationId },
    data: { isRead: true },
  })
}
