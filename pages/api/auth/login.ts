import type { NextApiRequest, NextApiResponse } from 'next'
import { withValidation } from 'next-validations'

import { UserSession } from '@/common/types'
import { loginSchema } from '@/common/validators'
import { apiHandler } from '@/server/lib/api'
import { withSessionRoute } from '@/server/lib/session'
import AuthenticationService from '@/server/services/authentication'

const handler = apiHandler()

handler.post(
  withValidation({ schema: loginSchema, mode: 'body', type: 'Zod' })(),
  async function (req: NextApiRequest, res: NextApiResponse<UserSession & { message?: string }>) {
    const { session } = req
    const { username, password } = await req.body
    const userSessionWithMessage = await AuthenticationService.logIn(username, password, session)
    res.json(userSessionWithMessage)
  }
)

export default withSessionRoute(handler)
