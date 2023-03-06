import ApiError from '../lib/error'

export class UserNotFoundError extends ApiError {
  constructor(meta: any = undefined) {
    super('User was not found', 404)
    this.meta = meta
    Object.setPrototypeOf(this, UserNotFoundError.prototype)
  }
}
