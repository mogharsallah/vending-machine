import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({
  // log: ['query', 'info', 'warn', 'error'],
  log: ['error'],
})

export default prisma
