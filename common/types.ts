import { NextPage } from 'next'
import { ReactElement, ReactNode } from 'react'

import './declarations'

export type UserRole = 'buyer' | 'seller'
export type UserSession = { id: string; username: string; role: UserRole; session: string }
export type UserSessionWithDeposit = UserSession & { deposit: number }

export type Coin = 5 | 10 | 20 | 50 | 100

export type CoinsPayload = Coin[]

export type PaginatedResponse<T> = {
  items: T[]
  pagination: {
    count: number
    pagesCount: number
    currentPage: number
    limit: number
    hasMore: boolean
  }
}

export type SortDirection = 'asc' | 'desc'

export type NextPageWithLayout<P = {}, IP = P> = NextPage<P, IP> & {
  getLayout?: (page: ReactElement) => ReactNode
}
