import ApiError from '../lib/error'

export class UsernameExistError extends ApiError {
  constructor(username: any) {
    super('Username exist', 409)
    this.meta = { username }
    Object.setPrototypeOf(this, UsernameExistError.prototype)
  }
}
