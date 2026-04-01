import * as React from 'react'
import { Slot } from '@radix-ui/react-slot'
import { cva, type VariantProps } from 'class-variance-authority'

import { cn } from '@/lib/utils'

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium transition-colors disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:outline-none",
  {
    variants: {
      variant: {
        default:
          'bg-primary text-white hover:bg-primary-hover',
        destructive:
          'bg-destructive text-white hover:bg-destructive/90',
        outline:
          'border border-[rgba(0,0,0,0.12)] bg-transparent text-foreground hover:bg-surface-alt',
        secondary:
          'bg-surface-alt text-foreground hover:bg-[#e8edf1]',
        ghost:
          'bg-transparent text-foreground hover:bg-surface-alt',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        default: 'h-9 px-5 py-2 has-[>svg]:px-4',
        sm: 'h-8 gap-1.5 px-4 has-[>svg]:px-3',
        lg: 'h-11 px-6 has-[>svg]:px-5',
        icon: 'size-9',
        'icon-sm': 'size-8',
        'icon-lg': 'size-10',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  },
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<'button'> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : 'button'

  return (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )
}

export { Button, buttonVariants }

