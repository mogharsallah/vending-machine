import { NextApiHandler } from 'next'
import logger from '@/server/lib/logger'
import prisma from '@/server/lib/prisma'

/* 
  This is endpoint allows cleaning the database. It is called periodically to clean the demo database
 */
const handler: NextApiHandler = async (req, res) => {
  const purgeSecret = req.query.secret

  if (process.env.PURGE_SECRET && purgeSecret === process.env.PURGE_SECRET) {
    logger.info('Purging database...')
    await prisma.session.deleteMany()
    await prisma.product.deleteMany()
    await prisma.user.deleteMany()
    logger.info('Database purged successfully...')
  } else {
    const randomSleepTime = Math.floor(Math.random() * 5000)
    await await new Promise((r) => setTimeout(r, randomSleepTime))
  }

  res.json({ success: true })
}

export default handler
