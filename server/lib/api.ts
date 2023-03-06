import { NextApiRequest, NextApiResponse } from 'next'
import nc from 'next-connect'

import AuthenticationService from '../services/authentication'
import ApiError, { handleApiError } from './error'

async function useSessionAuthenticationMiddleware(req: NextApiRequest, res: NextApiResponse, next: any) {
  switch (true) {
    /* 
      The api route rules are separated from frontend rules to for the sake of separation of concern.
      This separation reduces the risks of mistakes altering api rules which are critical on real applications.
     */

    // Add Public api routes here:
    case req.url.startsWith('/api/user') && req.method === 'POST':
    case req.url.startsWith('/api/auth/login') && req.method === 'POST':
    case req.url.startsWith('/api/product/') && req.method === 'GET':
    case req.url.startsWith('/api/product') && req.method === 'GET':
      next()
      break
    default:
      // Handle validation
      if (!req.session.user) {
        req.session.destroy()
        throw new ApiError('Unauthenticated', 401)
      }

      if (!(await AuthenticationService.isValidSession(req.session))) {
        req.session.destroy()
        throw new ApiError('Session expired', 440)
      }

      // Forward request if the session is "valid"
      next()
  }
}

export const ncOptions = {
  onError(error: Error, req: NextApiRequest, res: NextApiResponse) {
    handleApiError(error, req, res)
  },
  onNoMatch(req: NextApiRequest, res: NextApiResponse) {
    const error = new ApiError(`Method '${req.method}' not allowed`, 405)
    handleApiError(error, req, res)
  },
}

export function apiHandler() {
  return nc<NextApiRequest, NextApiResponse>(ncOptions).use(useSessionAuthenticationMiddleware)
}

export default nc
