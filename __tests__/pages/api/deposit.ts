import { coins } from '@/common/coins'

import handler from '../../../pages/api/deposit'
import { setupDatabase, tearDownDatabase } from '../../__lib__/api/database'
import { user_buyer_1, user_seller_1 } from '../../__lib__/api/fixtures/database'
import { loggedInApiTester } from '../../__lib__/api/testHandler'

describe('POST /api/deposit', () => {
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
        url: '/api/deposit',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST', body: JSON.stringify({ deposit: [100] }) })
          expect(res.status).toEqual(403)
        },
      })
    })
  })

  describe('As a "Buyer"', () => {
    it('should return a Bad request when no coins provided', async () => {
      await loggedInApiTester({
        user: user_buyer_1,
        handler,
        url: '/api/deposit',
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST', body: JSON.stringify({ deposit: [] }) })
          expect(res.status).toEqual(400)
        },
      })
    })

    it('should return a Bad request when some coins are invalid', async () => {
      await loggedInApiTester({
        user: user_buyer_1,
        handler,
        url: '/api/deposit',
        test: async ({ fetch }) => {
          const res1 = await fetch({ method: 'POST', body: JSON.stringify({ deposit: [100, 5, 3, 20] }) })
          expect(res1.status).toEqual(400)

          const res2 = await fetch({ method: 'POST', body: JSON.stringify({ deposit: [0] }) })
          expect(res2.status).toEqual(400)

          const res4 = await fetch({ method: 'POST', body: JSON.stringify({ deposit: [-5] }) })
          expect(res2.status).toEqual(400)
        },
      })
    })
    describe('When deposit payload is valid', () => {
      beforeEach(async () => {
        await tearDownDatabase()
        await setupDatabase()
      })

      it('should accept all supported coins', async () => {
        await loggedInApiTester({
          user: user_buyer_1,
          handler,
          url: '/api/deposit',
          test: async ({ fetch }) => {
            const res = await fetch({ method: 'POST', body: JSON.stringify({ deposit: coins }) })
            expect(res.status).toEqual(200)
            await expect(await res.json()).toEqual({ deposit: 185 })
          },
        })
      })

      it('should add deposit to the user deposit and return the new value', async () => {
        await loggedInApiTester({
          user: user_buyer_1,
          handler,
          url: '/api/deposit',
          test: async ({ fetch }) => {
            const res = await fetch({ method: 'POST', body: JSON.stringify({ deposit: [5, 10, 20, 100, 5] }) })
            expect(res.status).toEqual(200)
            await expect(await res.json()).toEqual({ deposit: 140 })

            const res2 = await fetch({ method: 'POST', body: JSON.stringify({ deposit: [5] }) })
            expect(res2.status).toEqual(200)
            await expect(await res2.json()).toEqual({ deposit: 145 })
          },
        })
      })
    })
  })
})
