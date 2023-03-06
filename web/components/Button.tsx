import classNames from 'classnames'
import { ButtonHTMLAttributes, FC } from 'react'

import { LoadingIndicator } from './LoadingIndicator'

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: 'contained' | 'outlined'
  loading?: boolean
}

export const Button: FC<Props> = ({ className, variant = 'contained', loading = false, children, ...props }) => {
  return (
    <button
      type="button"
      {...props}
      data-variant={variant}
      className={classNames(
        'w-full min-h-[36px] px-4 py-1 data-[variant=outlined]:py-1 rounded-lg data-[variant=outlined]:border-2 box-border border-sky-600 bg-sky-600 active:bg-sky-500 data-[variant=outlined]:bg-transparent data-[variant=outlined]:active:bg-sky-300 font-medium text-white data-[variant=outlined]:text-sky-600 disabled:opacity-50',
        className
      )}
    >
      {loading ? <LoadingIndicator color={variant === 'contained' ? 'white' : 'primary'} /> : children}
    </button>
  )
}
