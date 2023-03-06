import { NextApiHandler } from 'next'
import bcrypt from 'bcrypt'

import logger from '@/server/lib/logger'
import prisma from '@/server/lib/prisma'

/* 
  This is endpoint allows cleaning the database. It is called periodically to clean the demo database
 */
const handler: NextApiHandler = async (req, res) => {
  const purgeSecret = req.query.secret

  if (process.env.PURGE_SECRET && purgeSecret === process.env.PURGE_SECRET) {
    logger.info('Purging database...')
    await prisma.$transaction(async (ctx) => {
      await ctx.session.deleteMany()
      await ctx.product.deleteMany()
      await ctx.user.deleteMany()

      await ctx.user.create({
        data: {
          ...fixture_buyer_1,
          password: await bcrypt.hash(process.env.DEMO_USER_PASSWORD, parseInt(process.env.SALT_ROUNDS, 10)),
        },
      })

      const seller = await ctx.user.create({
        data: {
          ...fixture_seller_1,
          password: await bcrypt.hash(process.env.DEMO_USER_PASSWORD, parseInt(process.env.SALT_ROUNDS, 10)),
        },
      })

      const products = fixture_products.map((product) => ({ ...product, sellerId: seller.id }))
      await ctx.product.createMany({ data: products })
    })
    logger.info('Database purged successfully...')
  } else {
    const randomSleepTime = Math.floor(Math.random() * 5000)
    await await new Promise((r) => setTimeout(r, randomSleepTime))
  }

  res.json({ success: true })
}

export default handler

/* Demo database fixtures */

const fixture_buyer_1 = {
  username: 'buyer_01',
  deposit: 500,
  role: 'buyer',
}

const fixture_seller_1 = {
  username: 'seller_01',
  role: 'seller',
}

const fixture_products = [
  {
    name: 'Cheesy Popcorn',
    description: 'A classic snack made with popped corn kernels coated in savory cheese powder.',
    imageId: 14,
    amountAvailable: 396,
    cost: 245,
  },
  {
    name: 'Trail Mix',
    description: 'A mix of nuts, seeds, and dried fruits, often eaten as a snack during outdoor activities.',
    imageId: 12,
    amountAvailable: 108,
    cost: 220,
  },
  {
    name: 'Beef Jerky',
    description: 'A dried and salted meat snack, often made from beef.',
    imageId: 11,
    amountAvailable: 74,
    cost: 140,
  },
  {
    name: 'Fruit Leather',
    description: 'A chewy and sweet snack made from pureed fruit that has been dried into thin sheets.',
    imageId: 15,
    amountAvailable: 24,
    cost: 215,
  },
  {
    name: 'Chips and Salsa',
    description: 'A crunchy snack made with tortilla chips and a spicy tomato-based salsa.',
    imageId: 10,
    amountAvailable: 19,
    cost: 65,
  },
  {
    name: 'Popcorn Balls',
    description:
      'A sweet and crunchy snack made by forming popped corn kernels into balls with melted marshmallows or caramel.',
    imageId: 15,
    amountAvailable: 10,
    cost: 255,
  },
  {
    name: 'Hummus and Pita Chips',
    description: 'A dip made from mashed chickpeas and tahini, served with crispy pita chips.',
    imageId: 10,
    amountAvailable: 189,
    cost: 450,
  },
  {
    name: 'Mini Pretzels',
    description: 'Small, twisted baked dough snacks, often sprinkled with salt or other seasonings.',
    imageId: 9,
    amountAvailable: 474,
    cost: 40,
  },
  {
    name: 'Granola Bars',
    description:
      'A sweet and chewy snack made from oats, nuts, and dried fruit, often held together with honey or another sticky sweetener.',
    imageId: 4,
    amountAvailable: 420,
    cost: 270,
  },
  {
    name: 'Yogurt-Covered Raisins',
    description: 'Raisins coated in a sweet and tangy yogurt coating, often eaten as a snack or added to trail mix.',
    imageId: 14,
    amountAvailable: 81,
    cost: 85,
  },
  {
    name: 'Popcorn with M&Ms',
    description: 'A sweet and salty snack made by combining popcorn with colorful chocolate candies.',
    imageId: 18,
    amountAvailable: 102,
    cost: 75,
  },
  {
    name: 'Rice Cakes with Almond Butter',
    description: 'A light and crunchy snack made by topping rice cakes with creamy almond butter.',
    imageId: 18,
    amountAvailable: 170,
    cost: 165,
  },
  {
    name: 'Fruit Salad',
    description:
      'A refreshing snack made by combining a variety of fresh fruits, often served with a dollop of yogurt or whipped cream.',
    imageId: 13,
    amountAvailable: 366,
    cost: 425,
  },
  {
    name: 'Cheese and Crackers',
    description: 'A classic snack made by pairing cheese with crackers or other savory biscuits.',
    imageId: 16,
    amountAvailable: 220,
    cost: 235,
  },
  {
    name: 'Dark Chocolate-Covered Pretzels',
    description:
      'Pretzels coated in rich, bittersweet chocolate, often sprinkled with sea salt for a sweet and salty flavor combination.',
    imageId: 13,
    amountAvailable: 170,
    cost: 5,
  },
  {
    name: 'Popcorn with Cinnamon and Sugar',
    description: 'A sweet and crunchy snack made by tossing popcorn with a blend of cinnamon and sugar.',
    imageId: 5,
    amountAvailable: 190,
    cost: 380,
  },
  {
    name: 'Celery with Peanut Butter',
    description: 'A healthy and satisfying snack made by spreading peanut butter on celery sticks.',
    imageId: 8,
    amountAvailable: 363,
    cost: 10,
  },
  {
    name: 'Dried Mango',
    description: 'Sweet and chewy slices of mango that have been dried to preserve their flavor and texture.',
    imageId: 16,
    amountAvailable: 131,
    cost: 50,
  },
  {
    name: 'Sweet Potato Chips',
    description:
      'Thinly sliced sweet potatoes that have been baked or fried until crispy, often seasoned with spices or sea salt.',
    imageId: 9,
    amountAvailable: 403,
    cost: 395,
  },
  {
    name: 'Hummus',
    description:
      "A dip made from mashed chickpeas, tahini, olive oil, lemon juice, and garlic. It's often served with pita bread or vegetables for dipping.",
    imageId: 13,
    amountAvailable: 305,
    cost: 380,
  },
  {
    name: 'Cheese and Crackers',
    description:
      'A simple snack of crackers and cheese. It can be made with a variety of cheese types and crackers, and is often served as an appetizer or snack plate.',
    imageId: 13,
    amountAvailable: 309,
    cost: 405,
  },
  {
    name: 'Yogurt Parfait',
    description:
      "A layered dessert made with yogurt, granola, and fruit. It's often eaten as a healthy breakfast or snack option.",
    imageId: 7,
    amountAvailable: 60,
    cost: 55,
  },
  {
    name: 'Veggies and Dip',
    description:
      "Raw vegetables served with a dip, such as ranch or hummus. It's a healthy snack option that's also great for parties and gatherings.",
    imageId: 14,
    amountAvailable: 326,
    cost: 330,
  },
  {
    name: 'Fruit Salad',
    description:
      "A mix of fresh fruit, often dressed with a sweet dressing. It's a healthy and refreshing snack or dessert option.",
    imageId: 11,
    amountAvailable: 256,
    cost: 470,
  },
  {
    name: 'Pretzels',
    description:
      "A baked snack made from dough that's twisted into a knot or other shape. It can be enjoyed plain or with a variety of seasonings and dips.",
    imageId: 11,
    amountAvailable: 84,
    cost: 160,
  },
  {
    name: 'Fruit Smoothie',
    description:
      "A blended drink made with fruit, yogurt, and sometimes ice cream or other ingredients. It's a refreshing and healthy snack or breakfast option.",
    imageId: 17,
    amountAvailable: 478,
    cost: 340,
  },
  {
    name: 'Beef Jerky',
    description:
      "A dried meat snack that's high in protein. It's often used as a portable snack for hiking or outdoor activities.",
    imageId: 15,
    amountAvailable: 476,
    cost: 245,
  },
  {
    name: 'Chex Mix',
    description:
      "A mix of cereal, pretzels, nuts, and sometimes crackers, coated in a seasoned butter sauce. It's a popular snack mix that's great for parties and gatherings.",
    imageId: 3,
    amountAvailable: 102,
    cost: 410,
  },
  {
    name: 'Rice Cakes',
    description:
      'A light, crispy snack made from puffed rice. It can be enjoyed plain or with a variety of toppings, such as peanut butter or hummus.',
    imageId: 1,
    amountAvailable: 156,
    cost: 195,
  },
  {
    name: 'Apple Slices and Peanut Butter',
    description:
      "Sliced apples served with peanut butter for dipping. It's a healthy snack option that's also a great way to satisfy a sweet tooth.",
    imageId: 12,
    amountAvailable: 107,
    cost: 445,
  },
]
