import { ReactElement } from 'react'

import { Header } from './Header'

export const MainLayout = (page: ReactElement) => {
  return (
    <main className="min-h-screen">
      <Header />
      <div className="container m-auto py-8 flex-1">{page}</div>
    </main>
  )
}
