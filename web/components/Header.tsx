import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, FormEvent, useCallback, useEffect, useMemo, useState } from 'react'

import { useLogout } from '../hooks/useLogout'
import useUser from '../hooks/useUser'
import { formatCurrency } from '../lib/currency'
import { SearchInput } from './SearchInput'
import { CodeIcon } from './icons/CodeIcon'
import { LoginIcon } from './icons/LoginIcon'
import { LogoutIcon } from './icons/LogoutIcon'
import { MoneyIcon } from './icons/MoneyIcon'
import { SnackIcon } from './icons/SnackIcon'

interface Props {}

export const Header: FC<Props> = () => {
  const router = useRouter()
  const { user } = useUser()
  const { logout } = useLogout()
  const searchQuery = useMemo(() => (router.query.search ? router.query.search.toString() : ''), [router.query.search])
  const [search, setSearch] = useState<string>(searchQuery)
  const handleSearch = useCallback(
    (e: FormEvent<HTMLFormElement>) => {
      e.preventDefault()
      if (search !== searchQuery) {
        const searchParams = new URLSearchParams()
        searchParams.append('search', search)
        searchParams.append('limit', '100')
        router.push(`/?${searchParams.toString()}`)
      }
    },
    [router, search, searchQuery]
  )

  const handleAuthClick = useCallback(() => {
    if (user) {
      logout()
    } else {
      router.push('/login')
    }
  }, [user, router, logout])

  useEffect(() => {
    setSearch(searchQuery)
  }, [searchQuery])

  return (
    <header className="w-full sticky h-14 flex justify-center items-center top-0 backdrop-blur-md bg-slate-900/80">
      <div className="container py-2 px-4 flex justify-between items-center">
        <form onSubmit={handleSearch}>
          <div className="flex items-center">
            <Link href="/">
              <SnackIcon className="h-6 w-6 mr-4 text-white" />
            </Link>
            <SearchInput
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search for products"
              className="w-96"
            />
            {user?.role === 'seller' && (
              <Link className="text-sm text-white font-medium ml-4" href="/my-products">
                My Products
              </Link>
            )}
            {user?.role === 'buyer' && (
              <Link className="flex items-center text-sm text-white font-medium ml-4" href="/deposit">
                <MoneyIcon className="mr-1" /> {formatCurrency(user?.deposit || 0)}
              </Link>
            )}
          </div>
        </form>
        <div className="flex">
          <Link
            href="/api-doc"
            target="_blank"
            className="mr-4 appearance-none no-underline flex items-center text-sm text-white"
          >
            API
            <CodeIcon className="ml-1" />
          </Link>
          <button
            onClick={handleAuthClick}
            className="appearance-none no-underline flex items-center text-sm text-white"
          >
            <span className="mr-1 font-normal">{user ? 'Sign out' : 'Sign in'}</span>
            {user ? <LogoutIcon /> : <LoginIcon />}
          </button>
        </div>
      </div>
    </header>
  )
}
