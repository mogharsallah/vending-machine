import { SessionNotFoundError } from '../errors/SessionNotFound'
import prisma from '../lib/prisma'

export default class SessionService {
  public static async create(userId: string) {
    const newSession = prisma.session.create({
      data: {
        userId,
      },
    })
    return newSession
  }

  public static async get(id: string, select: { user?: boolean } = {}) {
    const newSession = prisma.session.findUnique({ where: { id }, select: { id: true, ...select } })
    if (!newSession) {
      throw new SessionNotFoundError({ sessionId: id })
    }
    return newSession
  }

  public static async deleteByUserId(userId: string) {
    prisma.session.deleteMany({ where: { userId: userId } })
  }

  public static async delete(id: string) {
    prisma.session.delete({ where: { id } })
  }
}
