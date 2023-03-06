import { User } from '@prisma/client'

import { getCoinsBySum, getSumByCoins } from '@/common/coins'
import { CoinsPayload, UserRole } from '@/common/types'
import prisma from '@/server/lib/prisma'

import { InsufficientDeposit } from '../errors/InsufficientDeposit'
import { InvalidUserRoleError } from '../errors/InvalidUserRole'
import { ProductAmountNotAvailableError } from '../errors/ProductAmountNotAvailable'
import { UserNotFoundError } from '../errors/UserNotFound'
import { UsernameExistError } from '../errors/UsernameExist'
import ProductService from './product'
import SessionService from './session'
import { ProductNotFound } from '../errors/ProductNotFound'

export default class UserService {
  public static async create(username: string, password: string, role: UserRole) {
    const usersCount = await prisma.user.count({ where: { username } })
    console.log(usersCount)
    if (usersCount) {
      throw new UsernameExistError(username)
    }

    const newEntry = await prisma.user.create({
      data: {
        role,
        username,
        password,
      },
    })
    return newEntry
  }

  public static async get(
    id: string,
    select: { username?: boolean; id?: boolean; products?: boolean; password?: boolean; deposit?: boolean } = {}
  ) {
    const user = await prisma.user.findUnique({
      where: { id },
      select: { id: true, username: true, role: true, ...select },
    })
    if (!user) {
      throw new UserNotFoundError({ id })
    }
    return user
  }

  public static async getByUsername(
    username: string,
    select: { username?: boolean; id?: boolean; products?: boolean; password?: boolean } = {}
  ) {
    const user = await prisma.user.findUnique({
      where: { username },
      select: { id: true, username: true, role: true, ...select },
    })

    if (!user) {
      throw new UserNotFoundError({ username })
    }
    return user
  }

  public static async deposit(userId: string, depositPayload: CoinsPayload) {
    const user = await UserService.get(userId, { deposit: true })

    if ((user.role as UserRole) !== 'buyer') {
      throw new InvalidUserRoleError({ userId: userId, role: user.role })
    }

    const newDeposit = getSumByCoins(depositPayload)

    const totalDeposit = user.deposit + newDeposit

    await UserService.update(userId, { deposit: totalDeposit })

    return { deposit: totalDeposit }
  }

  public static async buyProduct(userId: string, productId: string, amount: number) {
    const user = await UserService.get(userId, { deposit: true })

    if ((user.role as UserRole) !== 'buyer') {
      throw new InvalidUserRoleError({ userId: userId, role: user.role })
    }

    /*
      The purchase logic must be executed all-or-none and in-order and without parallel resource alterations
      The purchase logic therefore is encapsulated in a single transaction to ensures these conditions
    */
    return await prisma.$transaction(async (ctx) => {
      const product = await ctx.product.findUnique({ where: { id: productId } })

      if (!product) {
        throw new ProductNotFound({ productId })
      }

      if (product.amountAvailable < amount) {
        throw new ProductAmountNotAvailableError({ productId, amount })
      }

      const price = product.cost * amount
      if (price > (user.deposit || 0)) {
        const neededDeposit = price - (user.deposit || 0)
        throw new InsufficientDeposit({ deposit: user.deposit, product, amount, neededDeposit })
      }

      const change = getCoinsBySum(user.deposit - price)

      await ctx.user.update({ where: { id: userId }, data: { deposit: 0 } })
      await ctx.product.update({
        where: { id: productId },
        data: { amountAvailable: product.amountAvailable - amount },
      })

      return {
        total: user.deposit,
        change: change,
        product,
        amount,
      }
    })
  }

  public static async update(id: string, data: Omit<Partial<User>, 'id'>) {
    if (data.username) {
      const existingUsernameCount = await prisma.user.count({ where: { id: { not: id }, username: data.username } })
      if (existingUsernameCount) {
        throw new UsernameExistError({ username: data.username, userId: id })
      }
    }

    const user = await prisma.user.update({
      where: { id },
      data,
    })

    // Remove all user products when user changes role to "buyer"
    if (data.role === 'buyer') {
      ProductService.deleteBySellerId(id)
    }

    return user
  }

  public static async resetDeposit(id: string) {
    await prisma.user.update({
      where: { id },
      data: { deposit: 0 },
    })
  }

  public static async delete(id: string) {
    await ProductService.deleteBySellerId(id)
    await SessionService.deleteByUserId(id)
    await prisma.user.delete({ where: { id } })
  }
}
