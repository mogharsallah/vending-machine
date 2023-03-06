import { Product as ProductType } from '@prisma/client'
import Head from 'next/head'

import { NextPageWithLayout, PaginatedResponse, UserSession } from '@/common/types'
import { withSessionSsr } from '@/server/lib/session'
import ProductService from '@/server/services/product'
import { MainLayout } from '@/web/components/MainLayout'
import { Product } from '@/web/components/Product'

interface Props {
  user: UserSession | null
  search: PaginatedResponse<ProductType>
}
const Home: NextPageWithLayout<Props> = ({ search }) => {
  return (
    <>
      <Head>
        <title>Vending machine</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
        {search.items.length > 0 ? (
          search.items.map((product) => <Product key={product.id} product={product} />)
        ) : (
          <p>No product found</p>
        )}
      </div>
    </>
  )
}

export default Home

Home.getLayout = MainLayout

export const getServerSideProps = withSessionSsr(async function getServerSideProps({ req, query }) {
  const products = await ProductService.search({
    searchTerm: query.search ? query.search.toString() : '',
    page: query.page ? parseInt(query.page.toString(), 10) : 0,
    limit: 100,
    sortDirection: 'asc',
  })

  return {
    props: {
      user: req.session.user || null,
      search: products,
    },
  }
})
