import { cn } from '@/lib/utils';
import { SelectHTMLAttributes } from 'react';

export function Select({
    className,
    children,
    ...props
}: SelectHTMLAttributes<HTMLSelectElement>) {
    return (
        <select
            className={cn(
                'border-base bg-panel w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]',
                className,
            )}
            {...props}
        >
            {children}
        </select>
    );
}
