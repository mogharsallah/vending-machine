import { Product } from '@prisma/client'
import { useFormik } from 'formik'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useEffect } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { NextPageWithLayout } from '@/common/types'
import { buySchema } from '@/common/validators'
import { ProductNotFound } from '@/server/errors/ProductNotFound'
import { withSessionSsr } from '@/server/lib/session'
import ProductService from '@/server/services/product'
import { BackLink } from '@/web/components/BackLink'
import { Button } from '@/web/components/Button'
import { MainLayout } from '@/web/components/MainLayout'
import { NumberInput } from '@/web/components/NumberInput'
import useUser from '@/web/hooks/useUser'
import { formatCurrency } from '@/web/lib/currency'

interface Props {
  product: Product
}
const Home: NextPageWithLayout<Props> = ({ product }) => {
  const router = useRouter()
  const { user, refreshUser } = useUser()

  const buyForm = useFormik({
    initialValues: {
      amount: 1,
      productId: product.id,
    },
    validationSchema: toFormikValidationSchema(buySchema),
    validateOnBlur: true,
    async onSubmit(values) {
      try {
        const response = await fetch('/api/buy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })

        if (response.ok) {
          const result = await response.json()
          window.alert(`Product successfully purchased. You receive ${JSON.stringify(result.change)} back`)
          refreshUser()
        }
      } catch (error) {
        // TODO: handle remaining error cases
      }
    },
  })

  useEffect(() => {
    if (!buyForm.errors.amount && user?.deposit < buyForm.values.amount * product.cost) {
      buyForm.setFieldError(
        'amount',
        'Your deposit is insufficient to purchase this amount. Please top-up your deposit'
      )
    }
  }, [buyForm, product.cost, user])

  const submitDisabled = buyForm.values.amount === 0 && user?.deposit < buyForm.values.amount * product.cost

  return (
    <>
      <Head>
        <title>{product.name}</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BackLink href="#" onClick={() => router.back()}>
        All products
      </BackLink>
      <div className="mt-4 max-w-sm">
        <Image
          priority
          src={`/product-images/product-${product.imageId}.png`}
          alt={`product-image-${product.imageId}`}
          width={400}
          height={400}
          className="mt-4 rounded-lg overflow-hidden"
        />
        <h2 className="mt-2">{product.name}</h2>
        <h3>{formatCurrency(product.cost)}</h3>
        <p>{product.description}</p>
        <div className="mt-8">
          {!user || user?.role === 'seller' ? (
            <p className="text-sky-600">Sign in with a buyer account to purchase this product</p>
          ) : (
            <form onSubmit={buyForm.handleSubmit}>
              <NumberInput
                min={1}
                title="Available amount"
                value={buyForm.values.amount}
                onChange={(value) => buyForm.setFieldValue('amount', value)}
                onBlur={buyForm.handleBlur('amount')}
                hint={buyForm.errors.amount}
              />
              <Button loading={buyForm.isSubmitting} disabled={submitDisabled} className="mt-4" type="submit">
                Buy
              </Button>
            </form>
          )}
        </div>
      </div>
    </>
  )
}

export default Home

Home.getLayout = MainLayout

export const getServerSideProps = withSessionSsr(async function getServerSideProps({ params, req }) {
  try {
    const product = await ProductService.get(params.productId.toString())

    return {
      props: {
        product,
      },
    }
  } catch (error) {
    if (error instanceof ProductNotFound) {
      return {
        notFound: true,
      }
    }
  }
})
