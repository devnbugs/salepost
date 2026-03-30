import { ReactNode } from 'react';

export default function PageHeader({
    title,
    description,
    actions,
}: {
    title: string;
    description?: string;
    actions?: ReactNode;
}) {
    return (
        <div className="mb-6 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="space-y-1">
                <h1 className="text-3xl font-bold">{title}</h1>
                {description ? (
                    <p className="max-w-2xl text-sm text-muted-copy">
                        {description}
                    </p>
                ) : null}
            </div>
            {actions ? <div className="flex items-center gap-3">{actions}</div> : null}
        </div>
    );
}
