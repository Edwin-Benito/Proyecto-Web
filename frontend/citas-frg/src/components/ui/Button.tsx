import React, { forwardRef } from 'react'

type Variant = 'primary' | 'secondary'
type Size = 'sm' | 'md' | 'lg'

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant
  size?: Size
}

const variantClasses: Record<Variant, string> = {
  primary:
    'bg-indigo-600 text-white hover:bg-indigo-700 focus:ring-indigo-500',
  secondary:
    'bg-white text-gray-700 border border-gray-300 hover:bg-gray-50 focus:ring-gray-400',
}

const sizeClasses: Record<Size, string> = {
  sm: 'px-2 py-1 text-sm',
  md: 'px-4 py-2 text-base',
  lg: 'px-6 py-3 text-lg',
}

const base =
  'inline-flex items-center justify-center rounded-md font-medium focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition'

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', size = 'md', className = '', children, ...rest }, ref) => {
    const classes = `${base} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`.trim()

    return (
      <button ref={ref} className={classes} {...rest}>
        {children}
      </button>
    )
  }
)

Button.displayName = 'Button'

export default Button
