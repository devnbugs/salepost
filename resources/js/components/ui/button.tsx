import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { ButtonHTMLAttributes, forwardRef } from 'react';

const buttonVariants = cva(
    'inline-flex items-center justify-center gap-2 rounded-xl text-sm font-medium transition focus:outline-none focus:ring-2 focus:ring-[hsl(var(--ring))] focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50',
    {
        variants: {
            variant: {
                default:
                    'bg-[hsl(var(--primary))] px-4 py-2 text-[hsl(var(--primary-foreground))] shadow-sm hover:opacity-95',
                secondary:
                    'bg-[hsl(var(--secondary))] px-4 py-2 text-[hsl(var(--secondary-foreground))] hover:opacity-95',
                outline:
                    'border border-base bg-transparent px-4 py-2 text-current hover:bg-muted-panel',
                ghost: 'px-3 py-2 text-current hover:bg-muted-panel',
                danger:
                    'bg-[hsl(var(--danger))] px-4 py-2 text-white hover:opacity-95',
            },
            size: {
                default: '',
                sm: 'px-3 py-1.5 text-xs',
                lg: 'px-5 py-3 text-base',
                icon: 'h-10 w-10',
            },
        },
        defaultVariants: {
            variant: 'default',
            size: 'default',
        },
    },
);

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> &
    VariantProps<typeof buttonVariants>;

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, ...props }, ref) => (
        <button
            ref={ref}
            className={cn(buttonVariants({ variant, size }), className)}
            {...props}
        />
    ),
);

Button.displayName = 'Button';
