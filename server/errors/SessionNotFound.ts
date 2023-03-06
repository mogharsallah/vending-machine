import ApiError from '../lib/error'

export class SessionNotFoundError extends ApiError {
  constructor(meta: any) {
    super('Session was not found', 404)
    this.meta = meta
    Object.setPrototypeOf(this, SessionNotFoundError.prototype)
  }
}
