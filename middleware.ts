import { getIronSession } from 'iron-session/edge'
import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

import { edgeSessionOptions } from './edge/session'

const NonSessionRoutes = ['/login', '/register']
const ApiRoutes = ['/api/:path*']
const WithSessionRoutes = []
const SellerRoutes = ['/my-products']
const BuyerRoutes = ['/deposit']
const FileSystemRoutes = ['/public', '/_next/static']
const PublicRoutes = [...ApiRoutes, ...FileSystemRoutes]

export const middleware = async (req: NextRequest) => {
  const res = NextResponse.next()
  const session = await getIronSession(req, res, edgeSessionOptions)

  const { user } = session

  if (PublicRoutes.some((route) => req.nextUrl.pathname.startsWith(route))) {
    return res
  }

  if (user) {
    res.cookies.set(process.env.NEXT_PUBLIC_LOGGIN_IN_COOCKIE_NAME, 'true', { httpOnly: false })
  } else {
    res.cookies.delete(process.env.NEXT_PUBLIC_LOGGIN_IN_COOCKIE_NAME)
  }

  if (req.nextUrl.pathname.startsWith('/logout')) {
    await session.destroy()
    return NextResponse.redirect(new URL('/', req.url))
  }

  const isBuyerRoute = BuyerRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  if (user?.role !== 'buyer' && isBuyerRoute) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const isSellerRoute = SellerRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  if (user?.role !== 'seller' && isSellerRoute) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const isNonSessionRoute = NonSessionRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  if (isNonSessionRoute && user) {
    return NextResponse.redirect(new URL('/', req.url))
  }

  const isSessionRoute = WithSessionRoutes.some((route) => req.nextUrl.pathname.startsWith(route))
  if (isSessionRoute && !user) {
    return NextResponse.redirect(new URL('/login', req.url))
  }

  return res
}
