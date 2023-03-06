import type { NextApiRequest, NextApiResponse } from 'next'
import { withValidation } from 'next-validations'

import { UserRole, UserSessionWithDeposit } from '@/common/types'
import { createUserSchema, updateUserSchema } from '@/common/validators'
import { apiHandler } from '@/server/lib/api'
import { withSessionRoute } from '@/server/lib/session'
import AuthenticationService from '@/server/services/authentication'
import UserService from '@/server/services/user'

const handler = apiHandler()

handler.post(
  withValidation({ schema: createUserSchema, mode: 'body', type: 'Zod' })(),
  async function (req: NextApiRequest, res: NextApiResponse<UserSessionWithDeposit>) {
    const { session } = req
    const { username, password, role } = await req.body
    const userSessionWithDeposit = await AuthenticationService.signUp(username, password, role, session)

    res.json(userSessionWithDeposit)
  }
)

handler.get(async function (req: NextApiRequest, res: NextApiResponse<UserSessionWithDeposit>) {
  const { session } = req
  const user = await UserService.get(session.user.id, { deposit: true })
  res.json({
    session: session.user.session,
    id: user.id,
    deposit: user.deposit,
    role: user.role as UserRole,
    username: user.username,
  })
})

handler.patch(
  withValidation({ schema: updateUserSchema, mode: 'body', type: 'Zod' })(),
  async function (req: NextApiRequest, res: NextApiResponse<{ success: boolean }>) {
    const { session } = req
    const { username, role } = await req.body
    const user = await UserService.update(session.user.id, {
      username,
      role,
    })

    // Refresh the session with the updated properties
    await AuthenticationService.updateCurrentSession(session, { username: user.username, role: user.role as UserRole })

    res.json({ success: true })
  }
)

handler.delete(async function (req: NextApiRequest, res: NextApiResponse<{ success: boolean }>) {
  const { session } = req
  const user = await UserService.delete(session.user.id)
  session.destroy()

  res.json({ success: true })
})

export default withSessionRoute(handler)
