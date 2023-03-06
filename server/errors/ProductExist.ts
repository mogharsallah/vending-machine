import ApiError from '../lib/error'

export class ProductExistError extends ApiError {
  constructor(meta: any) {
    super('Product with the same name exist', 409)
    this.meta = meta
    Object.setPrototypeOf(this, ProductExistError.prototype)
  }
}
