import ApiError from '../lib/error'

export class ForbiddenError extends ApiError {
  constructor(resource: string, meta: any = undefined) {
    super(`Forbidden operation on ressource: ${resource}`, 404)
    this.meta = meta
    Object.setPrototypeOf(this, ForbiddenError.prototype)
  }
}
