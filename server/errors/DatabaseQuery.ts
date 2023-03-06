import ApiError from '../lib/error'

export class DatabaseError extends ApiError {
  constructor(meta: any) {
    super('Database error', 500)
    this.meta = meta
    Object.setPrototypeOf(this, DatabaseError.prototype)
  }
}
