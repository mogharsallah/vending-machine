import ApiError from '../lib/error'

export class ProductAmountNotAvailableError extends ApiError {
  constructor(meta: any) {
    super('Product amount not available', 400)
    this.meta = meta
    Object.setPrototypeOf(this, ProductAmountNotAvailableError.prototype)
  }
}
