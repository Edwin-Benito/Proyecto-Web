import { useForm, UseFormReturn, FieldValues, DefaultValues } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { ZodSchema } from 'zod'

interface UseFormValidationProps<T extends FieldValues> {
  schema: ZodSchema<T>
  defaultValues?: DefaultValues<T>
  mode?: 'onBlur' | 'onChange' | 'onSubmit' | 'onTouched' | 'all'
}

export function useFormValidation<T extends FieldValues>({
  schema,
  defaultValues,
  mode = 'onBlur'
}: UseFormValidationProps<T>): UseFormReturn<T> {
  return useForm<T>({
    resolver: zodResolver(schema),
    defaultValues,
    mode
  })
}

// Hook para validación de campos individuales
export function useFieldValidation<T>(
  schema: ZodSchema<T>,
  value: T
): { isValid: boolean; error: string | null } {
  const result = schema.safeParse(value)
  
  return {
    isValid: result.success,
    error: result.success ? null : result.error.errors[0]?.message || 'Error de validación'
  }
}
