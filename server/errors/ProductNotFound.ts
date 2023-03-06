import ApiError from '../lib/error'

export class ProductNotFound extends ApiError {
  constructor(meta: any = undefined) {
    super('Product was not found', 404)
    this.meta = meta
    Object.setPrototypeOf(this, ProductNotFound.prototype)
  }
}
