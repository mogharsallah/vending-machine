import { Product } from '@prisma/client'
import { useFormik } from 'formik'
import Head from 'next/head'
import Image from 'next/image'
import { useRouter } from 'next/router'
import { useCallback, useMemo } from 'react'
import { toFormikValidationSchema } from 'zod-formik-adapter'

import { NextPageWithLayout } from '@/common/types'
import { createProductSchema } from '@/common/validators'
import { ProductNotFound } from '@/server/errors/ProductNotFound'
import { withSessionSsr } from '@/server/lib/session'
import ProductService from '@/server/services/product'
import { BackLink } from '@/web/components/BackLink'
import { Button } from '@/web/components/Button'
import { Input } from '@/web/components/Input'
import { MainLayout } from '@/web/components/MainLayout'
import { NumberInput } from '@/web/components/NumberInput'
import { TextArea } from '@/web/components/textArea'

interface Props {
  product?: Product
}
const Home: NextPageWithLayout<Props> = ({ product }) => {
  const router = useRouter()
  const initialValues = useMemo(() => {
    if (!product) {
      return {
        name: '',
        description: '',
        cost: 0,
        amountAvailable: 0,
        imageId: 1,
      }
    }
    const { name, description, cost, amountAvailable, imageId } = product
    return { name, description, cost, amountAvailable, imageId }
  }, [product])

  const productForm = useFormik({
    initialValues,

    validateOnBlur: true,
    validateOnChange: false,
    validationSchema: toFormikValidationSchema(createProductSchema),
    async onSubmit(values) {
      try {
        const response = await fetch(product ? `/api/product/${product.id}` : '/api/product', {
          method: product ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(values),
        })
        if (response.ok) {
          router.push('/my-products')
        }
      } catch (e) {}
    },
  })

  const handleDelete = useCallback(async () => {
    if (product && window.confirm('Are you sure?')) {
      const response = await fetch(`/api/product/${product.id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
      })
      if (response.ok) {
        router.push('/my-products')
      }
    }
  }, [product, router])

  return (
    <>
      <Head>
        <title>Add product</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <BackLink href="/my-products">My products</BackLink>
      <h2>Add product</h2>
      <div className="mt-4 max-w-sm">
        <form onSubmit={productForm.handleSubmit}>
          <Input
            placeholder="Product name"
            name="name"
            type="text"
            value={productForm.values.name}
            onChange={productForm.handleChange('name')}
            onBlur={productForm.handleBlur('name')}
            error={productForm.touched.name && productForm.errors.name}
          />
          <TextArea
            placeholder="Product description"
            name="description"
            maxLength={500}
            value={productForm.values.description}
            onChange={productForm.handleChange('description')}
            onBlur={productForm.handleBlur('description')}
            error={productForm.touched.description && productForm.errors.description}
          />
          <Input
            placeholder="Cost"
            name="cost"
            type="text"
            value={productForm.values.cost}
            onChange={(e) =>
              productForm.setFieldValue('cost', e.target.value === '' ? '' : parseInt(e.target.value, 10))
            }
            onBlur={productForm.handleBlur('cost')}
            error={productForm.touched.cost && productForm.errors.cost}
          />
          <NumberInput
            title="Available amount"
            value={productForm.values.amountAvailable}
            onChange={(value) => productForm.setFieldValue('amountAvailable', value)}
            onBlur={productForm.handleBlur('amountAvailable')}
            error={productForm.touched.amountAvailable && productForm.errors.amountAvailable}
          />
          <div className="border-2 flex flex-wrap justify-center rounded-lg overflow-hidden">
            {Array.from({ length: 18 }, (_, i) => i + 1).map((imageId) => (
              <button
                type="button"
                onClick={() => productForm.setFieldValue('imageId', imageId)}
                key={imageId}
                data-selected={imageId === productForm.values.imageId ? 'selected' : undefined}
                className="border-2 border-white border-box hover:border-sky-500 data-[selected=selected]:border-sky-500 rounded-md overflow-hidden"
              >
                <Image width={59} height={59} alt={`image-${imageId}`} src={`/product-images/product-${imageId}.png`} />
              </button>
            ))}
          </div>
          <Button loading={productForm.isSubmitting} type="submit" className="mt-6">
            Save
          </Button>
          {product && (
            <Button className="mt-6" onClick={handleDelete} variant="outlined">
              Delete
            </Button>
          )}
        </form>
      </div>
    </>
  )
}

export default Home

Home.getLayout = MainLayout

export const getServerSideProps = withSessionSsr(async function getServerSideProps({ params, req }) {
  if (params.productId === 'add' || typeof params.productId !== 'string') {
    return {
      props: {
        product: null,
      },
    }
  }

  try {
    const product = await ProductService.get(params.productId)

    if (product.id !== req.session.user.id) {
      return {
        notFound: true,
      }
    }

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
