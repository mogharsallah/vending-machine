import { Product } from '@prisma/client'

import { PaginatedResponse, SortDirection, UserRole } from '@/common/types'
import prisma from '@/server/lib/prisma'

import { ForbiddenError } from '../errors/Forbidden'
import { InvalidUserRoleError } from '../errors/InvalidUserRole'
import { ProductExistError } from '../errors/ProductExist'
import { ProductNotFound } from '../errors/ProductNotFound'
import UserService from './user'

export default class ProductService {
  public static async get(productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } })

    if (!product) {
      throw new ProductNotFound({ productId })
    }

    return product
  }

  public static async create(sellerId: string, data: Omit<Product, 'id' | 'sellerId'>) {
    const user = await UserService.get(sellerId, { products: true })

    if ((user.role as UserRole) !== 'seller') {
      throw new InvalidUserRoleError({ userId: sellerId, role: user.role })
    }

    if (user.products.some((product) => product.name === data.name)) {
      throw new ProductExistError({ name: data.name })
    }

    const newProduct = await prisma.product.create({ data: { ...data, sellerId } })

    return newProduct
  }

  public static async update(sellerId: string, productId: string, data: Partial<Omit<Product, 'id' | 'sellerId'>>) {
    const product = await prisma.product.findUnique({ where: { id: productId } })

    if (!product) {
      throw new ProductNotFound({ productId, sellerId })
    }

    if (product.sellerId !== sellerId) {
      throw new ForbiddenError('product belongs to a different seller', { productId, sellerId })
    }

    if (data.name) {
      const existingProductWithTheSameName = await prisma.product.count({
        where: { name: data.name, sellerId: sellerId, id: { not: product.id } },
      })

      if (existingProductWithTheSameName) {
        throw new ProductExistError({ name: data.name })
      }
    }

    const updatedProduct = await prisma.product.update({ where: { id: productId }, data })

    return updatedProduct
  }

  public static async delete(sellerId: string, productId: string) {
    const product = await prisma.product.findUnique({ where: { id: productId } })
    if (!product) {
      throw new ProductNotFound({ productId, sellerId })
    }

    if (product.sellerId !== sellerId) {
      throw new ForbiddenError('product belongs to a different seller', { productId, sellerId })
    }

    await prisma.product.delete({ where: { id: productId } })
  }

  public static async deleteBySellerId(sellerId: string) {
    await prisma.product.deleteMany({ where: { sellerId: sellerId } })
  }

  public static async search({
    searchTerm,
    page,
    limit,
    sortDirection,
    sellerId,
  }: {
    searchTerm: string
    page: number
    limit: number
    sortDirection: SortDirection
    sellerId?: string
  }): Promise<PaginatedResponse<Product>> {
    const searchQuery = searchTerm
      ? {
          name: {
            search: searchTerm,
          },
          description: {
            search: searchTerm,
          },
        }
      : {}

    if (sellerId) {
      ;(searchQuery as { [key: string]: any }).sellerId = sellerId
    }

    const count = await prisma.product.count({ where: searchQuery })

    const products = await prisma.product.findMany({
      skip: page * limit,
      take: limit,
      orderBy: {
        name: sortDirection,
      },
      where: searchQuery,
    })

    return {
      items: products,
      pagination: {
        count,
        limit,
        currentPage: page,
        hasMore: count > limit * (page + 1),
        pagesCount: limit > 0 ? Math.ceil(count / limit) : 0,
      },
    }
  }
}
