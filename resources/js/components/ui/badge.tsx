import { cn } from '@/lib/utils';
import { cva, type VariantProps } from 'class-variance-authority';
import { HTMLAttributes } from 'react';

const badgeVariants = cva(
    'inline-flex items-center rounded-full px-2.5 py-1 text-xs font-semibold',
    {
        variants: {
            variant: {
                default: 'bg-muted-panel text-current',
                primary:
                    'bg-[hsl(var(--primary))]/10 text-[hsl(var(--primary))]',
                success:
                    'bg-[hsl(var(--success))]/10 text-[hsl(var(--success))]',
                warning: 'bg-amber-500/10 text-amber-600 dark:text-amber-300',
                danger: 'bg-[hsl(var(--danger))]/10 text-[hsl(var(--danger))]',
            },
        },
        defaultVariants: {
            variant: 'default',
        },
    },
);

type BadgeProps = HTMLAttributes<HTMLSpanElement> &
    VariantProps<typeof badgeVariants>;

export function Badge({ className, variant, ...props }: BadgeProps) {
    return (
        <span className={cn(badgeVariants({ variant }), className)} {...props} />
    );
}
