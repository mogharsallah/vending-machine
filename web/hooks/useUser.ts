import Cookies from 'js-cookie'
import Router from 'next/router'
import { useCallback, useEffect } from 'react'
import useSWR from 'swr'

import { UserSessionWithDeposit } from '@/common/types'

export default function useUser({ redirectIfFound = false } = {}) {
  const { data: user, mutate: mutateUser } = useSWR<UserSessionWithDeposit | null>('/api/user', {
    async fetcher(url) {
      if (!Cookies.get(process.env.NEXT_PUBLIC_LOGGIN_IN_COOCKIE_NAME)) {
        return null
      }

      const response = await fetch('/api/user')
      if (response.ok) {
        return response.json()
      } else {
        return null
      }
    },
  })

  const refreshUser = useCallback(async () => {
    const response = await fetch('/api/user')
    if (response.ok) {
      mutateUser(response.json())
    }
  }, [mutateUser])

  useEffect(() => {
    if (redirectIfFound && user) {
      Router.push('/')
    }
  }, [user, redirectIfFound])

  return { user: user as UserSessionWithDeposit | null, mutateUser, refreshUser }
}
