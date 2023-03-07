import { Product as ProductType } from '@prisma/client'
import classNames from 'classnames'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { FC } from 'react'

interface Props extends Omit<LinkProps, 'href'> {
  product: ProductType
  href?: string
  className?: string
}

export const Product: FC<Props> = ({ product, className, ...props }) => {
  return (
    <Link
      href={`/products/${product.id}`}
      {...props}
      className={classNames('w-[200px] h-[200px] drop-shadow-2xl', className)}
    >
      <Image
        priority
        src={`/product-images/product-${product.imageId}.png`}
        alt="Picture of the author"
        width={200}
        height={200}
        className="rounded-lg overflow-hidden border-1 border-slate-100 hover:border-sky-300 "
      />
    </Link>
  )
}
