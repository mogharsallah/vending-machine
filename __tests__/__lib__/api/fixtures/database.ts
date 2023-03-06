import { Product, Session, User } from '@prisma/client'

/* Users */
export const user_buyer_1_password = '12345678'
export const user_buyer_1: User = {
  id: 'cler8ljt8000076iszrm41uhh',
  username: 'buyer_1',
  password: '$2b$04$MI3rB3UssrWIffrNPAOUcOxYAOuDzU5ErfBuHgW7NLqqOqa7YJpKS',
  role: 'buyer',
  deposit: 0,
  createdAt: new Date(),
  lastSignIn: new Date(),
}

export const user_seller_1_password = '12345678'
export const user_seller_1: User = {
  id: 'cler8ljt8000076iszrm41uhm',
  username: 'seller_1',
  password: '$2b$04$dUAOP8N3xKCmdeslBUOjhOk6M8s7xBm7HOrxnxwccktSgp955EOAO',
  role: 'seller',
  deposit: 0,
  createdAt: new Date(),
  lastSignIn: new Date(),
}

/* Sessions */

export const user_seller_1_session: Session = {
  id: 'cler8ljt8000076iszrm41uhl',
  userId: user_buyer_1.id,
  createdAt: new Date(),
}

export const user_seller_2_session: Session = {
  id: 'cler8ljt8000076iszrm41umn',
  userId: user_seller_1.id,
  createdAt: new Date(),
}

/* Products */

export const product_1: Product = {
  id: 'cleqbkswd000376s8xgv0pcat',
  name: 'Pepsi zero',
  description: 'No sugar',
  imageId: 1,
  amountAvailable: 187,
  cost: 250,
  sellerId: user_seller_1.id,
}

export const product_2: Product = {
  id: 'cleqeqbns0001769faapb59yc',
  name: 'Coca Cola',
  description: '',
  imageId: 2,
  amountAvailable: 400,
  cost: 250,
  sellerId: user_seller_1.id,
}
