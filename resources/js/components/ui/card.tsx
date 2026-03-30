import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

export function Card({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return (
        <div
            className={cn(
                'bg-panel border-base rounded-2xl border shadow-sm',
                className,
            )}
            {...props}
        />
    );
}

export function CardHeader({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('space-y-1 p-6', className)} {...props} />;
}

export function CardTitle({
    className,
    ...props
}: HTMLAttributes<HTMLHeadingElement>) {
    return <h3 className={cn('text-lg font-semibold', className)} {...props} />;
}

export function CardDescription({
    className,
    ...props
}: HTMLAttributes<HTMLParagraphElement>) {
    return (
        <p className={cn('text-sm text-muted-copy', className)} {...props} />
    );
}

export function CardContent({
    className,
    ...props
}: HTMLAttributes<HTMLDivElement>) {
    return <div className={cn('p-6 pt-0', className)} {...props} />;
}
