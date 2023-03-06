import ApiError from '../lib/error'

export class InternalServerError extends ApiError {
  constructor(meta: any) {
    super('Internal server issue', 500)
    this.meta = meta
    Object.setPrototypeOf(this, InternalServerError.prototype)
  }
}
