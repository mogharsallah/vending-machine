import prisma from '@/server/lib/prisma'

import handler from '../../../pages/api/buy'
import { setupDatabase, tearDownDatabase } from '../../__lib__/api/database'
import { product_1, user_buyer_1, user_seller_1 } from '../../__lib__/api/fixtures/database'
import { loggedInApiTester } from '../../__lib__/api/testHandler'

describe('POST /api/buy', () => {
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
          const res = await fetch({ method: 'POST', body: JSON.stringify({ productId: product_1.id, amount: 1 }) })
          expect(res.status).toEqual(403)
        },
      })
    })
  })

  describe('As a "Buyer"', () => {
    it('should return a Bad request when no productId provided', async () => {
      await loggedInApiTester({
        user: user_buyer_1,
        handler,
        url: '/api/buy',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST', body: JSON.stringify({ amount: 1 }) })
          expect(res.status).toEqual(400)
        },
      })
    })

    it('should return a Bad request when amount is not valid', async () => {
      await loggedInApiTester({
        user: user_buyer_1,
        handler,
        url: '/api/buy',
        test: async ({ fetch }) => {
          const res1 = await fetch({ method: 'POST', body: JSON.stringify({ productId: product_1.id, amount: 0 }) })
          expect(res1.status).toEqual(400)

          const res2 = await fetch({ method: 'POST', body: JSON.stringify({ productId: product_1.id, amount: 101 }) })
          expect(res2.status).toEqual(400)

          const res3 = await fetch({ method: 'POST', body: JSON.stringify({ productId: product_1.id, amount: -1 }) })
          expect(res3.status).toEqual(400)

          const res4 = await fetch({ method: 'POST', body: JSON.stringify({ productId: product_1.id, amount: 2.1 }) })
          expect(res4.status).toEqual(400)
        },
      })
    })

    it('should return a Not Found Error when product is not available', async () => {
      await loggedInApiTester({
        user: user_buyer_1,
        handler,
        url: '/api/buy',
        test: async ({ fetch }) => {
          const res1 = await fetch({
            method: 'POST',
            body: JSON.stringify({ productId: product_1.id + '-', amount: 1 }),
          })
          expect(res1.status).toEqual(404)
        },
      })
    })

    it('should return a Bad Request when request amount is not available', async () => {
      await loggedInApiTester({
        user: user_buyer_1,
        handler,
        url: '/api/buy',
        test: async ({ fetch }) => {
          const res1 = await fetch({
            method: 'POST',
            body: JSON.stringify({ productId: product_1.id, amount: product_1.amountAvailable + 1 }),
          })
          expect(res1.status).toEqual(400)
        },
      })
    })

    it('should return a Bad Request when user deposit is insufficient to buy the requested product and amount', async () => {
      await loggedInApiTester({
        user: user_buyer_1,
        handler,
        url: '/api/buy',
        test: async ({ fetch }) => {
          const res1 = await fetch({ method: 'POST', body: JSON.stringify({ productId: product_1.id, amount: 1 }) })
          expect(res1.status).toEqual(400)
          await expect((await res1.json()).message).toEqual(
            `Insufficient deposit, please insert ${product_1.cost} to purchase the product`
          )

          // Top up user deposit
          await prisma.user.update({ where: { id: user_buyer_1.id }, data: { deposit: 300 } })

          const res2 = await fetch({ method: 'POST', body: JSON.stringify({ productId: product_1.id, amount: 2 }) })
          expect(res2.status).toEqual(400)
          await expect((await res2.json()).message).toEqual(
            `Insufficient deposit, please insert ${product_1.cost * 2 - 300} to purchase the product`
          )
        },
      })
    })

    describe('When buy request is valid', () => {
      it('should return the change, product details, amount and total cost', async () => {
        // Top up user deposit
        await prisma.user.update({ where: { id: user_buyer_1.id }, data: { deposit: 635 } })

        await loggedInApiTester({
          user: user_buyer_1,
          handler,
          url: '/api/buy',
          test: async ({ fetch }) => {
            const res1 = await fetch({
              method: 'POST',
              body: JSON.stringify({ productId: product_1.id, amount: 2 }),
            })
            expect(res1.status).toEqual(200)
            await expect(await res1.json()).toEqual({
              amount: 2,
              change: [100, 20, 10, 5],
              product: product_1,
              total: 635,
            })
          },
        })
      })

      it('should should set user deposit to "0" after', async () => {
        const user = await prisma.user.findUnique({ where: { id: user_buyer_1.id } })
        expect(user.deposit).toEqual(0)
      })
    })
  })
})
