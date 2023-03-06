import ApiError from '../lib/error'

export class InsufficientDeposit extends ApiError {
  constructor(meta: any) {
    const message = meta.neededDeposit
      ? `Insufficient deposit, please insert ${meta.neededDeposit} to purchase the product`
      : 'Insufficient deposit'
    super(message, 400)
    this.meta = meta
    Object.setPrototypeOf(this, InsufficientDeposit.prototype)
  }
}
