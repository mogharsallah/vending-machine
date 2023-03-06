import { User } from '@prisma/client'
import { testApiHandler, NtarhParameters } from 'next-test-api-route-handler'

import { user_buyer_1 } from './fixtures/database'
import { sessionCookieGenerator } from './sessionGenerator'

type AuthenticatedTestHandlerArguments = NtarhParameters<any> & { user?: User }

const defaultHeaders = { 'content-type': 'application/json' }

export async function loggedInApiTester({
  user = user_buyer_1,
  requestPatcher,
  ...options
}: AuthenticatedTestHandlerArguments) {
  const sessionCookie = await sessionCookieGenerator(user)
  await testApiHandler({
    rejectOnHandlerError: true,
    requestPatcher: (req) => (req.headers = { cookie: sessionCookie, ...defaultHeaders }),
    ...options,
  })
}

export async function loggedOutTestHandler({ requestPatcher, ...options }: AuthenticatedTestHandlerArguments) {
  await testApiHandler({
    requestPatcher: (req) => (req.headers = { ...defaultHeaders }),
    ...options,
  })
}
