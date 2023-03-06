import classNames from 'classnames'
import Link, { LinkProps } from 'next/link'
import { FC } from 'react'

import { ChevronBackIcon } from './icons/ChevronBack'

interface Props extends Omit<LinkProps, 'children'> {
  className?: string
  children: string
}
export const BackLink: FC<Props> = ({ className, children, ...props }) => {
  return (
    <Link className={classNames('flex items-center text-slate-600', className)} {...props}>
      <ChevronBackIcon className="mr-1" /> {children}
    </Link>
  )
}
