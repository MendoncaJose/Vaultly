import { prisma } from '../../lib/prisma'
import { hashPassword, comparePassword } from '../../lib/password'
import {
  signAccessToken,
  signRefreshToken,
  verifyRefreshToken,
  hashToken,
} from '../../lib/jwt'
import { env } from '../../config/env'
import type { RegisterInput, LoginInput } from './auth.schema'

export interface PublicUser {
  id: string
  email: string
  name: string | null
  role: string
  plan: string
  preferredCurrency: string
  createdAt: Date
}

function toPublicUser(user: {
  id: string
  email: string
  name: string | null
  role: string
  plan: string
  preferredCurrency: string
  createdAt: Date
}): PublicUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    plan: user.plan,
    preferredCurrency: user.preferredCurrency,
    createdAt: user.createdAt,
  }
}

function getRefreshTokenExpiryDate(): Date {
  const val = env.REFRESH_TOKEN_EXPIRES_IN
  const match = val.match(/^(\d+)([smhd])$/)
  const multipliers: Record<string, number> = { s: 1, m: 60, h: 3600, d: 86400 }
  const seconds = match
    ? parseInt(match[1]) * (multipliers[match[2]] ?? 1)
    : 7 * 86400
  return new Date(Date.now() + seconds * 1000)
}

export async function registerUser(input: RegisterInput) {
  const existing = await prisma.user.findUnique({ where: { email: input.email } })
  if (existing) throw Object.assign(new Error('Email already in use'), { status: 409 })

  const passwordHash = await hashPassword(input.password)

  const user = await prisma.user.create({
    data: {
      email: input.email,
      passwordHash,
      name: input.name ?? null,
      portfolio: { create: {} },
    },
  })

  const accessToken = signAccessToken({ userId: user.id, email: user.email })
  const refreshToken = signRefreshToken({ userId: user.id })
  const tokenHash = hashToken(refreshToken)

  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash, expiresAt: getRefreshTokenExpiryDate() },
  })

  return { user: toPublicUser(user), accessToken, refreshToken }
}

export async function loginUser(input: LoginInput) {
  const user = await prisma.user.findUnique({ where: { email: input.email } })
  if (!user) throw Object.assign(new Error('Invalid credentials'), { status: 401 })

  const valid = await comparePassword(input.password, user.passwordHash)
  if (!valid) throw Object.assign(new Error('Invalid credentials'), { status: 401 })

  const accessToken = signAccessToken({ userId: user.id, email: user.email })
  const refreshToken = signRefreshToken({ userId: user.id })
  const tokenHash = hashToken(refreshToken)

  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash, expiresAt: getRefreshTokenExpiryDate() },
  })

  return { user: toPublicUser(user), accessToken, refreshToken }
}

export async function refreshSession(token: string) {
  const payload = verifyRefreshToken(token)
  const tokenHash = hashToken(token)

  const stored = await prisma.refreshToken.findUnique({ where: { tokenHash } })
  if (!stored || stored.expiresAt < new Date()) {
    throw Object.assign(new Error('Invalid or expired refresh token'), { status: 401 })
  }

  const user = await prisma.user.findUnique({ where: { id: payload.userId } })
  if (!user) throw Object.assign(new Error('User not found'), { status: 401 })

  await prisma.refreshToken.delete({ where: { tokenHash } })

  const accessToken = signAccessToken({ userId: user.id, email: user.email })
  const newRefreshToken = signRefreshToken({ userId: user.id })
  const newTokenHash = hashToken(newRefreshToken)

  await prisma.refreshToken.create({
    data: { userId: user.id, tokenHash: newTokenHash, expiresAt: getRefreshTokenExpiryDate() },
  })

  return { user: toPublicUser(user), accessToken, refreshToken: newRefreshToken }
}

export async function logoutUser(token: string) {
  const tokenHash = hashToken(token)
  await prisma.refreshToken.deleteMany({ where: { tokenHash } })
}

export async function getMe(userId: string) {
  const user = await prisma.user.findUnique({ where: { id: userId } })
  if (!user) throw Object.assign(new Error('User not found'), { status: 404 })
  return toPublicUser(user)
}

export async function updateMe(userId: string, data: { preferredCurrency?: string }) {
  const user = await prisma.user.update({
    where: { id: userId },
    data: {
      ...(data.preferredCurrency ? { preferredCurrency: data.preferredCurrency as import('../../generated/prisma').CurrencyCode } : {}),
    },
  })
  return toPublicUser(user)
}
