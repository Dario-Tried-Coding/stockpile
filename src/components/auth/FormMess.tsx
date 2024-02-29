import { cn } from '@/lib/utils'
import { AlertTriangle, Check } from 'lucide-react'
import { FC } from 'react'

export interface FormMessProps {
  message: string
  variant: 'error' | 'success'
}

const FormMess: FC<FormMessProps> = ({ message, variant }) => {
  if (!message) return null

  return (
    <span
      className={cn('flex items-center gap-x-2 rounded-md p-3 text-sm text-left', {
        'bg-success text-success-foreground': variant === 'success',
        'bg-destructive text-destructive-foreground': variant === 'error',
      })}
    >
      {variant === 'success' ? <Check className='w-4 h-4 shrink-0' /> : <AlertTriangle className='w-4 h-4 shrink-0' />}
      <span>{message}</span>
    </span>
  )
}

export default FormMess
