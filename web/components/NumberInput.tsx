import { ChangeEvent, FC, InputHTMLAttributes, useCallback } from 'react'

interface Props extends Omit<InputHTMLAttributes<HTMLInputElement>, 'value' | 'type' | 'onChange'> {
  error?: string
  hint?: string
  value?: number
  onChange?: (value: number) => void
}

export const NumberInput: FC<Props> = ({ className, error, hint, children, value, onChange, title, ...props }) => {
  const handleChange = useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      onChange(parseInt(e.target.value, 10))
    },
    [onChange]
  )

  const increment = useCallback(() => {
    if (onChange) {
      onChange((value || 0) + 1)
    }
  }, [value, onChange])

  const decrement = useCallback(() => {
    if (onChange) {
      onChange((value || 1) - 1)
    }
  }, [value, onChange])

  return (
    <div className={className}>
      <div
        title={title}
        className=" min-h-[36px] flex justify-between items-center w-full px-2 bg-white rounded-lg border-2 border-slate-200 focus-within:border-sky-600"
      >
        <button
          type="button"
          onClick={decrement}
          className="appearance-none p-x-1 w-4 flex justify-center items-center hover:text-sky-500 text-lg font-medium"
        >
          -
        </button>
        <input
          className="flex-1 mx-2 text-center appearance-none outline-none bg-transparent"
          type="number"
          {...props}
          min="0"
          step="1"
          pattern="/d+"
          value={value}
          onChange={handleChange}
        />
        <button
          type="button"
          onClick={increment}
          className="appearance-none p-x-1 w-4 flex justify-center items-center hover:text-sky-500 text-lg font-medium"
        >
          +
        </button>
      </div>
      <div className="block min-h-[1.5rem]">
        {!!error && <p className="text-red-500 w-full">{error}</p>}
        {!!hint && <p className="text-gray-500 w-full">{hint}</p>}
      </div>
    </div>
  )
}
