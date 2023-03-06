import { z } from 'zod'

import { coins, smallestCoin } from './coins'
import { UserRole } from './types'

/* Common validators */

export const emptySchema = z.object({}).strict()

/* User validators */

export const usernameSchema = z
  .string()
  .min(6)
  .max(20)
  .regex(/^[a-z0-9_]*$/, 'Only lowercase alphanumeric and "_" characters are supported')
  .trim()

export const passwordSchema = z.string().min(6).max(20).trim()

const roles: UserRole[] = ['buyer', 'seller']
const rolesSchema = z.enum(roles as any)

export const createUserSchema = z
  .object({
    username: usernameSchema,
    password: passwordSchema,
    role: rolesSchema,
  })
  .strict()

export const updateUserSchema = z
  .object({
    username: usernameSchema.optional(),
    role: rolesSchema.optional(),
  })
  .strict()

export const updatePasswordSchema = z
  .object({
    password: passwordSchema,
    newPassword: passwordSchema,
    deleteActiveSessions: z.boolean().optional(),
  })
  .strict()

/* Authentication validators */
export const loginSchema = z
  .object({
    username: usernameSchema.optional(),
    password: passwordSchema.optional(),
  })
  .strict()

/* Product validators */

const productNameSchema = z.string().min(4).max(50).trim()
const productDescriptionSchema = z.string().max(500).trim().optional()
const productImageSchema = z.number().min(1).max(18).int().optional()

const productCostSchema = z
  .number()
  .min(5)
  .max(100000)
  .multipleOf(
    smallestCoin,
    `Product cost must be payable with supported coins, please provide a price divisible by ${smallestCoin} cents`
  )
  .int()
const productAmountAvailableSchema = z.number().min(0).max(100000).int()

export const createProductSchema = z
  .object({
    name: productNameSchema,
    description: productDescriptionSchema,
    cost: productCostSchema,
    amountAvailable: productAmountAvailableSchema,
    imageId: productImageSchema,
  })
  .strict()

export const updateProductSchema = z
  .object({
    name: productNameSchema.optional(),
    description: productDescriptionSchema,
    cost: productCostSchema.optional(),
    amountAvailable: productAmountAvailableSchema.optional(),
    imageId: productImageSchema,
  })
  .strict()

/* Search query validation */

// query params numbers are strings, parse them before validating
// only req.query are strings, req.body preserves correct types
const stringToNumber = (numberArg: unknown): unknown => {
  // convert (arg: string): number | undefined to (arg: unknown): unknown
  // for typescript strict
  const numberStr = numberArg as string
  const result = numberStr ? parseInt(z.string().parse(numberStr), 10) : undefined
  return result as unknown
}

export const searchQuerySchema = z
  .object({
    sellerId: z.string().optional(),
    page: z.preprocess(stringToNumber, z.number().min(1).int().optional()),
    limit: z.preprocess(stringToNumber, z.number().min(1).max(100).int().optional()),
    searchTerm: z.string().optional().or(z.literal('')),
    sortDirection: z.string().optional().or(z.literal('')).or(z.literal('asc')).or(z.literal('desc')),
  })
  .strict()

/* Deposit validators */

const coinSchema = z.nativeEnum(coins as any)

export const depositSchema = z
  .object({
    deposit: z.array(coinSchema).nonempty(),
  })
  .strict()

/* Buy validators */

export const buySchema = z
  .object({
    productId: z.string(),
    amount: z.number().int().min(1).max(100),
  })
  .strict()
