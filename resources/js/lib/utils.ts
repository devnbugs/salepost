import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function currency(value: number | string | null | undefined, code = 'NGN') {
    const amount = Number(value ?? 0);

    return new Intl.NumberFormat('en-NG', {
        style: 'currency',
        currency: code,
        minimumFractionDigits: 2,
    }).format(amount);
}
