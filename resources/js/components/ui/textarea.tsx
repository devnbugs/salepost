import { cn } from '@/lib/utils';
import { forwardRef, TextareaHTMLAttributes } from 'react';

export const Textarea = forwardRef<
    HTMLTextAreaElement,
    TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
    <textarea
        ref={ref}
        className={cn(
            'border-base bg-panel min-h-[120px] w-full rounded-xl border px-3 py-2 text-sm shadow-sm outline-none transition focus:ring-2 focus:ring-[hsl(var(--ring))]',
            className,
        )}
        {...props}
    />
));

Textarea.displayName = 'Textarea';
