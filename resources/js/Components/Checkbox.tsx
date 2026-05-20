import { InputHTMLAttributes } from 'react';

export default function Checkbox({
    className = '',
    ...props
}: InputHTMLAttributes<HTMLInputElement>) {
    return (
        <input
            {...props}
            type="checkbox"
            className={
                'rounded-sm border-input bg-background text-primary shadow-sm focus:ring-ring focus:ring-offset-background ' +
                className
            }
        />
    );
}
