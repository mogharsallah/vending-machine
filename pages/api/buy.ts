import { Product } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { withValidation } from 'next-validations'

import { CoinsPayload } from '@/common/types'
import { buySchema } from '@/common/validators'
import { InvalidUserRoleError } from '@/server/errors/InvalidUserRole'
import { apiHandler } from '@/server/lib/api'
import { withSessionRoute } from '@/server/lib/session'
import UserService from '@/server/services/user'

const handler = apiHandler()

handler.post(
  withValidation({ schema: buySchema, mode: 'body', type: 'Zod' })(),
  async function (
    req: NextApiRequest,
    res: NextApiResponse<{ total: number; change: CoinsPayload; product: Product; amount: number }>
  ) {
    const { session } = req

    if (session.user.role !== 'buyer') {
      throw new InvalidUserRoleError({ userId: session.user.id, role: session.user.role })
    }
    const result = await UserService.buyProduct(session.user.id, req.body.productId, req.body.amount)

    res.json(result)
  }
)

export default withSessionRoute(handler)
