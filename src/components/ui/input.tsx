import * as React from 'react'

import { cn } from '@/lib/utils'

function Input({ className, type, ...props }: React.ComponentProps<'input'>) {
  return (
    <input
      type={type}
      data-slot="input"
      className={cn(
        'file:text-foreground placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground h-9 w-full min-w-0 rounded-md border border-[rgba(0,0,0,0.10)] bg-white px-3 py-1 text-sm transition-[color,box-shadow,border-color] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50',
        'focus-visible:ring-0 focus-visible:border-primary focus-visible:shadow-[inset_0_-2px_0_0_#00b0f0]',
        'aria-invalid:border-destructive/50 aria-invalid:shadow-[inset_0_-2px_0_0_#ef4444]',
        className,
      )}
      {...props}
    />
  )
}

export { Input }

