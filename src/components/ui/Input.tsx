import { InputHTMLAttributes, forwardRef } from 'react'
import { clsx } from 'clsx'

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  error?: boolean
  fullWidth?: boolean
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ className, error = false, fullWidth = false, ...props }, ref) => {
    return (
      <input
        ref={ref}
        className={clsx(
          'block rounded-md border border-gray-300 px-3 py-2',
          'placeholder:text-gray-400',
          'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent',
          'disabled:bg-gray-100 disabled:cursor-not-allowed',
          {
            'border-red-500 focus:ring-red-500': error,
            'w-full': fullWidth,
          },
          className
        )}
        {...props}
      />
    )
  }
)

Input.displayName = 'Input'
