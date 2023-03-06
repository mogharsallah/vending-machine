import type { IronSessionOptions } from 'iron-session'

export const edgeSessionCookieName = process.env.NEXT_PUBLIC_SESSION_NAME
export const edgeSessionOptions: IronSessionOptions = {
  password: process.env.SESSION_SECRET as string,
  cookieName: edgeSessionCookieName,
  cookieOptions: {
    // force https on production to allow using http while running locally
    secure: process.env.NODE_ENV === 'production',
  },
}
