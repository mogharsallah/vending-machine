import prisma from '@/server/lib/prisma'

import handler from '../../../pages/api/reset'
import { setupDatabase, tearDownDatabase } from '../../__lib__/api/database'
import { product_1, user_buyer_1, user_seller_1 } from '../../__lib__/api/fixtures/database'
import { loggedInApiTester } from '../../__lib__/api/testHandler'

describe('POST /api/reset', () => {
  beforeAll(async () => {
    await setupDatabase()
  })
  afterAll(async () => {
    await tearDownDatabase()
  })

  describe('As a "Seller"', () => {
    it('should not allow deposit', async () => {
      await loggedInApiTester({
        user: user_seller_1,
        handler,
        url: '/api/buy',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST', body: JSON.stringify({}) })
          expect(res.status).toEqual(403)
        },
      })
    })
  })

  describe('As a "Buyer"', () => {
    it('should reset deposit to 0', async () => {
      // Top up user deposit
      await prisma.user.update({ where: { id: user_buyer_1.id }, data: { deposit: 300 } })

      await loggedInApiTester({
        user: user_buyer_1,
        handler,
        url: '/api/reset',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST', body: JSON.stringify({}) })
          expect(res.status).toEqual(200)
          await expect(await res.json()).toEqual({ success: true })

          const user = await prisma.user.findUnique({ where: { id: user_buyer_1.id } })
          expect(user.deposit).toEqual(0)
        },
      })
    })
  })
})
