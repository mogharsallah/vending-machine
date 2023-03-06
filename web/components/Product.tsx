import { Product as ProductType } from '@prisma/client'
import Image from 'next/image'
import Link, { LinkProps } from 'next/link'
import { FC } from 'react'

interface Props extends Omit<LinkProps, 'href'> {
  product: ProductType
  href?: string
  className?: string
}

export const Product: FC<Props> = ({ product, ...props }) => {
  return (
    <Link href={`/products/${product.id}`} {...props}>
      <div className="w-[200px] h-[200px] rounded-lg border-slate-100 drop-shadow-2xl overflow-hidden hover:scale-105 transition-all">
        <Image
          priority
          src={`/product-images/product-${product.imageId}.png`}
          alt="Picture of the author"
          width={200}
          height={200}
        />
      </div>
    </Link>
  )
}
