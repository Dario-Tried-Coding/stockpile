import { Icons } from '@/components/Icons'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import { Loader2 } from 'lucide-react'
import { FC, HTMLAttributes } from 'react'

interface SocialAuthProps extends HTMLAttributes<HTMLDivElement> {
  disabled: boolean
  isLoading: 'google' | null
  continueWithProvider: (provider: 'google') => void
}

const SocialAuth: FC<SocialAuthProps> = ({ isLoading, disabled, continueWithProvider, className, ...rest }) => {
  return (
    <div className={cn('flex flex-col', className)} {...rest}>
      <Button className='gap-1' variant='outline' onClick={() => continueWithProvider('google')} type='button' disabled={disabled || (isLoading !== null && isLoading !== 'google')}>
        {isLoading === 'google' ? <Loader2 className='h-4 w-4 animate-spin' /> : <Icons.google className='h-4 w-4' />} <span>Google</span>
      </Button>
    </div>
  )
}

export default SocialAuth
