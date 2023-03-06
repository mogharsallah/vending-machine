import { Product } from '@prisma/client'
import type { NextApiRequest, NextApiResponse } from 'next'
import { withValidation } from 'next-validations'

import { PaginatedResponse } from '@/common/types'
import { createProductSchema, searchQuerySchema } from '@/common/validators'
import { InvalidUserRoleError } from '@/server/errors/InvalidUserRole'
import { apiHandler } from '@/server/lib/api'
import { withSessionRoute } from '@/server/lib/session'
import ProductService from '@/server/services/product'

const handler = apiHandler()

handler.post(
  withValidation({ schema: createProductSchema, mode: 'body', type: 'Zod' })(),
  async function (req: NextApiRequest, res: NextApiResponse<Product>) {
    const { session } = req

    if (session.user.role !== 'seller') {
      throw new InvalidUserRoleError({ userId: session.user.id, role: session.user.role })
    }
    const product = await ProductService.create(session.user.id, req.body)

    res.json(product)
  }
)

handler.get(
  withValidation({
    schema: searchQuerySchema,
    type: 'Zod',
    mode: 'query',
  })(),
  async function (req: NextApiRequest, res: NextApiResponse<PaginatedResponse<Product>>) {
    const { searchTerm, page, limit, sortDirection } = req.query as any

    const result = await ProductService.search({
      searchTerm: searchTerm || '',
      page: parseInt(page, 10) || 0,
      limit: parseInt(limit, 10) || 100,
      sortDirection: sortDirection || 'asc',
    })

    res.json(result)
  }
)

export default withSessionRoute(handler)
