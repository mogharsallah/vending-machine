import type { NextApiRequest, NextApiResponse } from 'next'
import { withValidation } from 'next-validations'

import { depositSchema } from '@/common/validators'
import { InvalidUserRoleError } from '@/server/errors/InvalidUserRole'
import { apiHandler } from '@/server/lib/api'
import { withSessionRoute } from '@/server/lib/session'
import UserService from '@/server/services/user'

const handler = apiHandler()

handler.post(
  withValidation({ schema: depositSchema, mode: 'body', type: 'Zod' })(),
  async function (req: NextApiRequest, res: NextApiResponse<{ deposit: number }>) {
    const { session } = req

    if (session.user.role !== 'buyer') {
      throw new InvalidUserRoleError({ userId: session.user.id, role: session.user.role })
    }
    const result = await UserService.deposit(session.user.id, req.body.deposit)

    res.json(result)
  }
)

export default withSessionRoute(handler)
