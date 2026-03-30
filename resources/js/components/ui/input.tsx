import { cn } from '@/lib/utils';
import { forwardRef, InputHTMLAttributes } from 'react';

export const Input = forwardRef<
    HTMLInputElement,
    InputHTMLAttributes<HTMLInputElement>
>(({ className, ...props }, ref) => (
    <input
        ref={ref}
        className={cn(
            'border-base bg-panel w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]',
            className,
        )}
        {...props}
    />
));

Input.displayName = 'Input';
