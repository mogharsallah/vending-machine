import { Product as ProductType } from '@prisma/client'
import Head from 'next/head'
import Link from 'next/link'

import { NextPageWithLayout, PaginatedResponse } from '@/common/types'
import { withSessionSsr } from '@/server/lib/session'
import ProductService from '@/server/services/product'
import { Button } from '@/web/components/Button'
import { MainLayout } from '@/web/components/MainLayout'
import { Product } from '@/web/components/Product'

interface Props {
  search: PaginatedResponse<ProductType>
}
const Home: NextPageWithLayout<Props> = ({ search }) => {
  return (
    <>
      <Head>
        <title>My products</title>
      </Head>

      <div className="flex items-center justify-between">
        <h2>My products</h2>
        <Link href="/my-products/add">
          <Button>Add product</Button>
        </Link>
      </div>
      <div className="mt-4 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-8">
        {search.items.map((product) => (
          <Product href={`/my-products/${product.id}`} key={product.id} product={product} />
        ))}
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
    sellerId: req.session.user.id,
  })

  return {
    props: {
      search: products,
    },
  }
})
