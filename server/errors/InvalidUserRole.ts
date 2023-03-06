import ApiError from '../lib/error'

export class InvalidUserRoleError extends ApiError {
  constructor(meta: any) {
    super('User role does not allow this operation', 403)
    this.meta = meta
    Object.setPrototypeOf(this, InvalidUserRoleError.prototype)
  }
}
