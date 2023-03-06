import { useRouter } from 'next/router'
import { useCallback } from 'react'

import useUser from './useUser'

export const useLogout = () => {
  const { user, mutateUser } = useUser()
  const router = useRouter()

  const logout = useCallback(async () => {
    if (!user) {
      return
    }
    const logoutFromAllDevices = confirm('Logout from all devices?')
    try {
      const result = await fetch(`api/auth/logout${logoutFromAllDevices ? '?all=true' : ''}`)
      if (result.ok) {
        mutateUser(null, false)
      }
    } catch (e) {
      // TODO: Handle error gracefully
    } finally {
      router.push('/')
    }
  }, [user, router, mutateUser])

  return {
    logout,
  }
}
