import type { NextApiRequest, NextApiResponse } from 'next'
import { withValidation } from 'next-validations'

import { emptySchema } from '@/common/validators'
import { InvalidUserRoleError } from '@/server/errors/InvalidUserRole'
import { apiHandler } from '@/server/lib/api'
import { withSessionRoute } from '@/server/lib/session'
import UserService from '@/server/services/user'

const handler = apiHandler()

handler.post(
  withValidation({ schema: emptySchema, mode: 'body', type: 'Zod' })(),
  async function (req: NextApiRequest, res: NextApiResponse<{ success: boolean }>) {
    const { session } = req

    if (session.user.role !== 'buyer') {
      throw new InvalidUserRoleError({ userId: session.user.id, role: session.user.role })
    }
    await UserService.resetDeposit(session.user.id)

    res.json({ success: true })
  }
)

export default withSessionRoute(handler)
