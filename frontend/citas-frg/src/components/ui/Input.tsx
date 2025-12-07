import React, { forwardRef, useId } from 'react'

export interface InputProps
  extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const baseInputClasses =
  'block w-full rounded-md border border-gray-300 px-3 py-2 text-sm shadow-sm focus:border-blue-500 focus:ring-2 focus:ring-blue-200 outline-none transition-colors'

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, id, className = '', ...rest }, ref) => {
    // Llamar a useId incondicionalmente al inicio del componente
    const hookId = useId()
    const generatedId = id ?? hookId
    const errorId = `${generatedId}-error`

    const ariaDescribedBy = error ? errorId : rest['aria-describedby']

    return (
      <div>
        {label && (
          <label htmlFor={generatedId} className="block text-sm font-medium text-gray-700 mb-1">
            {label}
          </label>
        )}

        <input
          id={generatedId}
          ref={ref}
          className={`${baseInputClasses} ${className}`.trim()}
          aria-describedby={ariaDescribedBy}
          aria-invalid={Boolean(error) || undefined}
          {...rest}
        />

        {error && (
          <p id={errorId} className="mt-1 text-sm text-red-600">
            {error}
          </p>
        )}
      </div>
    )
  }
)

Input.displayName = 'Input'

export default Input
