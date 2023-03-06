import { User } from '@prisma/client'
import { sealData } from 'iron-session'

import { UserRole, UserSession } from '@/common/types'
import prisma from '@/server/lib/prisma'
import { sessionCookieName, sessionOptions } from '@/server/lib/session'

export async function sealedSessionGenerator(user: User) {
  const session = await prisma.session.findFirst({ where: { userId: user.id } })
  if (!session) {
    throw new Error('No session found for the given test user!')
  }

  const sessionPayload: { user: UserSession } = {
    user: { id: user.id, username: user.username, role: user.role as UserRole, session: session.id },
  }
  return await sealData(sessionPayload, sessionOptions)
}

export async function sessionCookieGenerator(user: User) {
  const sealedSession = await sealedSessionGenerator(user)
  return `${sessionCookieName}=${sealedSession}`
}
