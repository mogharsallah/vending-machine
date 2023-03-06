import ApiError from '../lib/error'

export class InvalidCredentialsError extends ApiError {
  constructor(meta: any) {
    super('Invalid credentials', 400)
    this.meta = meta
    Object.setPrototypeOf(this, InvalidCredentialsError.prototype)
  }
}
