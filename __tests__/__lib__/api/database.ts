import { execSync } from 'child_process'
import { join } from 'path'

import prisma from '@/server/lib/prisma'

import {
  product_1,
  product_2,
  user_buyer_1,
  user_seller_1,
  user_seller_1_session,
  user_seller_2_session,
} from './fixtures/database'

const prismaBinary = join(__dirname, '..', '..', '..', 'node_modules', '.bin', 'prisma')

export async function populateDatabaseWithFixtures() {
  await prisma.user.createMany({ data: [user_buyer_1, user_seller_1] })
  await prisma.product.createMany({ data: [product_1, product_2] })
  await prisma.session.createMany({ data: [user_seller_1_session, user_seller_2_session] })
}

export async function setupDatabase() {
  // Generate Prisma schema
  execSync(`${prismaBinary} db push`, {
    env: {
      ...process.env,
      DATABASE_URL: process.env.DATABASE_URL,
    },
  })

  // Add test fixtures
  await prisma.$connect()
  await populateDatabaseWithFixtures()
}

export async function tearDownDatabase() {
  await prisma.$executeRawUnsafe(`DROP DATABASE test;`)
  await prisma.$executeRawUnsafe(`CREATE DATABASE test;`)
  await prisma.$disconnect()
}
