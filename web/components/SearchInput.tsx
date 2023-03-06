import classNames from 'classnames'
import { FC, InputHTMLAttributes } from 'react'

import { MagnifyingGlassIcon } from './icons/MagnifyingGlassIcon'

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  error?: string
  hint?: string
}

export const SearchInput: FC<Props> = ({ className, error, hint, children, ...props }) => {
  return (
    <div
      className={classNames(
        'min-h-[36px] px-4 py-1 flex items-center rounded-lg bg-slate-100 border-1 border-slate-600 box-border',
        className
      )}
    >
      <MagnifyingGlassIcon />
      <input
        {...props}
        className="appearance-none flex-1 focus:ring-0 focus:outline-none focus:appearance-none ml-2 bg-transparent font-normal placeholder:text-slate-400"
      />
    </div>
  )
}
