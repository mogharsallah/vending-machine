import { FC, TextareaHTMLAttributes } from 'react'

interface Props extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: string
  hint?: string
}

export const TextArea: FC<Props> = ({ className, error, hint, children, ...props }) => {
  return (
    <div className={className}>
      <textarea
        {...props}
        className="w-full min-h-[36px] px-2 py-1 rounded-lg bg-white border-2 border-slate-200 active:border-sky-600"
      />
      <div className="block min-h-[1.5rem]">
        {!!error && <p className="text-red-500 w-full text-sm">{error}</p>}
        {!!hint && <p className="text-gray-500 w-full text-sm">{hint}</p>}
      </div>
    </div>
  )
}
