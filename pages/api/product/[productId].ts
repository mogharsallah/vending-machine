import { Product } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { withValidation } from 'next-validations'

import { updateProductSchema } from '@/common/validators'
import { InvalidUserRoleError } from '@/server/errors/InvalidUserRole'
import { apiHandler } from '@/server/lib/api'
import { withSessionRoute } from '@/server/lib/session'
import ProductService from '@/server/services/product'

const handler = apiHandler()

handler.get(async function (req: NextApiRequest, res: NextApiResponse<Product>) {
  const { productId } = req.query

  const product = await ProductService.get(productId as string)

  res.json(product)
})

handler.patch(
  withValidation({ schema: updateProductSchema, mode: 'body', type: 'Zod' })(),
  async function (req: NextApiRequest, res: NextApiResponse<{ success: boolean }>) {
    const { session } = req
    const { productId } = req.query

    if (session.user.role !== 'seller') {
      throw new InvalidUserRoleError({ userId: session.user.id, role: session.user.role })
    }

    await ProductService.update(session.user.id, productId as string, req.body)

    res.json({ success: true })
  }
)

handler.delete(async function (req: NextApiRequest, res: NextApiResponse<{ success: boolean }>) {
  const { session } = req
  const { productId } = req.query

  if (session.user.role !== 'seller') {
    throw new InvalidUserRoleError({ userId: session.user.id, role: session.user.role })
  }

  await ProductService.delete(session.user.id, productId as string)

  res.json({ success: true })
})

export default withSessionRoute(handler)
