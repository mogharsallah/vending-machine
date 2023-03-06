import type { NextApiRequest, NextApiResponse } from 'next'

import { apiHandler } from '@/server/lib/api'
import { withSessionRoute } from '@/server/lib/session'
import AuthenticationService from '@/server/services/authentication'

const handler = apiHandler()

handler.get(async function (req: NextApiRequest, res: NextApiResponse<{ success: boolean }>) {
  const { session, query } = req
  const logOutFromAllSessions = query.all === 'true'
  await AuthenticationService.logOut(session.user.id, session, logOutFromAllSessions ? undefined : session.user.session)

  res.json({ success: true })
})

export default withSessionRoute(handler)
