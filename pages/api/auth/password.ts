import type { NextApiRequest, NextApiResponse } from 'next'
import { withValidation } from 'next-validations'

import { UserSession } from '@/common/types'
import { createUserSchema, updatePasswordSchema, updateUserSchema } from '@/common/validators'
import { apiHandler } from '@/server/lib/api'
import { withSessionRoute } from '@/server/lib/session'
import AuthenticationService from '@/server/services/authentication'

const handler = apiHandler()

handler.post(
  withValidation({ schema: updatePasswordSchema, mode: 'body', type: 'Zod' })(),
  async function (req: NextApiRequest, res: NextApiResponse<{ success: boolean }>) {
    const { session } = req
    const { password, newPassword, deleteActiveSessions } = await req.body

    if (password) {
      await AuthenticationService.changePassword(session.user.id, password, newPassword, session, deleteActiveSessions)
    }

    res.json({ success: true })
  }
)

export default withSessionRoute(handler)
