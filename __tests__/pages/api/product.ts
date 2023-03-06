import handler from '../../../pages/api/product'
import { setupDatabase, tearDownDatabase } from '../../__lib__/api/database'
import { product_1, user_buyer_1, user_seller_1 } from '../../__lib__/api/fixtures/database'
import { loggedInApiTester } from '../../__lib__/api/testHandler'

describe('POST /api/product', () => {
  beforeAll(async () => {
    await setupDatabase()
  })
  afterAll(async () => {
    await tearDownDatabase()
  })

  describe('As a "Buyer"', () => {
    it('should not allow deposit', async () => {
      await loggedInApiTester({
        user: user_buyer_1,
        handler,
        url: '/api/product',
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            body: JSON.stringify({ name: 'Random product', cost: 50, amountAvailable: 10 }),
          })
          expect(res.status).toEqual(403)
        },
      })
    })
  })

  describe('As a "Seller"', () => {
    it('should return a Bad request when product name is invalid', async () => {
      await loggedInApiTester({
        user: user_seller_1,
        handler,
        url: '/api/product',
        test: async ({ fetch }) => {
          /* When name is too short */
          const res = await fetch({
            method: 'POST',
            body: JSON.stringify({ name: '123', cost: 50, amountAvailable: 10 }),
          })
          expect(res.status).toEqual(400)
          await expect(await res.json()).toEqual({
            issues: [
              {
                code: 'too_small',
                exact: false,
                inclusive: true,
                message: 'String must contain at least 4 character(s)',
                minimum: 4,
                path: ['name'],
                type: 'string',
              },
            ],
            name: 'ZodError',
          })

          /* When name is too long */
          const res2 = await fetch({
            method: 'POST',
            body: JSON.stringify({
              name: '123123123123123123123123123123123123123123123123123123123123123123123123',
              cost: 50,
              amountAvailable: 10,
            }),
          })
          await expect(res2.status).toEqual(400)
          await expect(await res2.json()).toEqual({
            issues: [
              {
                code: 'too_big',
                exact: false,
                inclusive: true,
                message: 'String must contain at most 50 character(s)',
                maximum: 50,
                path: ['name'],
                type: 'string',
              },
            ],
            name: 'ZodError',
          })
        },
      })
    })

    it('should return a Bad request when product cost is invalid', async () => {
      await loggedInApiTester({
        user: user_seller_1,
        handler,
        url: '/api/product',
        test: async ({ fetch }) => {
          /* When cost can't be exchanged with the supported coins */
          const res = await fetch({
            method: 'POST',
            body: JSON.stringify({ name: 'Random product', cost: 51, amountAvailable: 10 }),
          })
          expect(res.status).toEqual(400)
          await expect(await res.json()).toEqual({
            issues: [
              {
                message:
                  'Product cost must be payable with supported coins, please provide a price divisible by 5 cents',

                path: ['cost'],
                code: 'not_multiple_of',
                multipleOf: 5,
              },
            ],
            name: 'ZodError',
          })

          /* When cost is too big */
          const res2 = await fetch({
            method: 'POST',
            body: JSON.stringify({
              name: 'Random product',
              cost: 100005,
              amountAvailable: 10,
            }),
          })
          expect(res2.status).toEqual(400)
          await expect(await res2.json()).toEqual({
            issues: [
              {
                code: 'too_big',
                exact: false,
                inclusive: true,
                message: 'Number must be less than or equal to 100000',
                maximum: 100000,
                path: ['cost'],
                type: 'number',
              },
            ],
            name: 'ZodError',
          })
        },
      })
    })

    it('should return a Bad request when the image id is invalid', async () => {
      await loggedInApiTester({
        user: user_seller_1,
        handler,
        url: '/api/product',
        test: async ({ fetch }) => {
          const res1 = await fetch({
            method: 'POST',
            body: JSON.stringify({ name: 'Random Product', cost: 50, amountAvailable: 10, image_id: 100 }),
          })

          expect(res1.status).toEqual(400)
        },
      })
    })

    it('should return a Conflict when the product name already exists', async () => {
      await loggedInApiTester({
        user: user_seller_1,
        handler,
        url: '/api/product',
        test: async ({ fetch }) => {
          const res1 = await fetch({
            method: 'POST',
            body: JSON.stringify({ name: product_1.name, cost: 50, amountAvailable: 10 }),
          })

          expect(res1.status).toEqual(409)
        },
      })
    })

    describe('When request is valid', () => {
      it('should create the product and return it', async () => {
        await loggedInApiTester({
          user: user_seller_1,
          handler,
          url: '/api/product',
          test: async ({ fetch }) => {
            const res1 = await fetch({
              method: 'POST',
              body: JSON.stringify({ name: 'New product', cost: 50, amountAvailable: 10 }),
            })

            await expect(await res1.json()).toMatchObject({ name: 'New product', cost: 50, amountAvailable: 10 })
          },
        })
      })
    })
  })
})
