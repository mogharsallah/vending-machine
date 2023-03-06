import { FC } from 'react'

type LogoutProps = {}

// This is a placeholder page, it won't be rendered. Check middleware.ts for logout logic
const Logout: FC<LogoutProps> = ({}) => {
  return (
    <main className="min-h-screen flex items-center justify-center">
      <div className="flex">...Redirecting</div>
    </main>
  )
}

export default Logout
