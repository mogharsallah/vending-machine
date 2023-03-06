import { NextApiRequest, NextApiResponse } from 'next'
import { ZodError } from 'zod'

import logger from './logger'

export default class ApiError extends Error {
  public readonly statusCode: number
  public meta: any

  constructor(message: string, statusCode: number) {
    super(message)

    this.statusCode = statusCode

    Error.captureStackTrace(this, this.constructor)

    Object.setPrototypeOf(this, ApiError.prototype)
  }

  static fromZodError(error: ZodError): ApiError {
    return new this(error.toString(), 400)
  }
}

export const handleApiError = (error: any, req: NextApiRequest, res: NextApiResponse) => {
  logger.error('handled API error: ', error)
  const isProd = process.env.NODE_ENV === 'production'

  const response = {
    ...(!isProd && { stack: error.stack }),
    message: error.message,
    statusCode: error.statusCode,
  }

  res.status(error.statusCode || 500).json(response)
}

export const handleSsrError = (error: any, req: NextApiRequest, res: NextApiResponse) => {
  logger.error('handled SSR error: ', error)
}
