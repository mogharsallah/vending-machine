import bcrypt from 'bcrypt'
import { IronSession } from 'iron-session'

import { UserRole, UserSession, UserSessionWithDeposit } from '@/common/types'

import { InvalidCredentialsError } from '../errors/InvalidCredentials'
import SessionService from './session'
import UserService from './user'

export default class AuthenticationService {
  public static async signUp(username: string, plainPassword: string, role: UserRole, session: IronSession) {
    const passwordHash = await bcrypt.hash(plainPassword, parseInt(process.env.SALT_ROUNDS, 10))

    const user = await UserService.create(username, passwordHash, role)

    const sessionModel = await SessionService.create(user.id)

    session.user = {
      username: user.username,
      id: user.id,
      role: user.role as UserRole,
      session: sessionModel.id,
    }

    const userSessionWithDeposit: UserSessionWithDeposit = {
      username: user.username,
      id: user.id,
      role: user.role as UserRole,
      session: sessionModel.id,
      deposit: user.deposit,
    }

    await session.save()

    return userSessionWithDeposit
  }

  public static async logIn(username: string, plainPassword: string, session: IronSession) {
    const user = await UserService.getByUsername(username, { password: true })

    const isPasswordCorrect = await bcrypt.compare(plainPassword, user.password)
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError({ username })
    }

    const sessionModel = await SessionService.create(user.id)

    session.user = {
      username: user.username,
      id: user.id,
      role: user.role as UserRole,
      session: sessionModel.id,
    }
    await session.save()

    return session.user
  }

  // If provided only the session associated to the sessionId will be removed, otherwise all user sessions will be removed
  public static async logOut(userId: string, session: IronSession, sessionId?: string) {
    if (sessionId) {
      await SessionService.delete(sessionId)
    } else {
      await SessionService.deleteByUserId(userId)
    }
    session.destroy()
  }

  public static async updateCurrentSession(session: IronSession, data: Omit<Partial<UserSession>, 'id' | 'session'>) {
    // Refresh the session with the updated properties
    session.user = {
      ...session.user,
      ...data,
    }
    await session.save()
  }

  public static async changePassword(
    id: string,
    plainPassword: string,
    newPlainPassword: string,
    session,
    deleteActiveSessions = false
  ) {
    const newPasswordHash = await bcrypt.hash(newPlainPassword, parseInt(process.env.SALT_ROUNDS, 10))

    const user = await UserService.get(id, { id: true, password: true })

    const isPasswordCorrect = await bcrypt.compare(plainPassword, user.password)
    if (!isPasswordCorrect) {
      throw new InvalidCredentialsError({ userId: id, session: session.id })
    }

    UserService.update(id, { password: newPasswordHash })

    if (deleteActiveSessions) {
      await SessionService.deleteByUserId(user.id)
      session.destroy()
    }

    return {
      user,
    }
  }

  // A session is defined as valid when there's a matching id in the sessions table. This is needed to prevent expired session from being used
  public static async isValidSession(session: IronSession): Promise<boolean> {
    if (!session.user) {
      return false
    }

    const sessionWithUser = await SessionService.get(session.user.session, { user: true })

    // Insure that the session has not been invalidated and belongs to rightful user
    if (!sessionWithUser || sessionWithUser.user.id !== session.user.id) {
      return false
    }

    return true
  }
}
