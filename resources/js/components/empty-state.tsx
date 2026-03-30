import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

export default function EmptyState({
    title,
    description,
    action,
}: {
    title: string;
    description: string;
    action?: ReactNode;
}) {
    return (
        <Card>
            <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
                <div className="rounded-full bg-muted-panel p-3" />
                <div>
                    <h3 className="text-lg font-semibold">{title}</h3>
                    <p className="mt-1 text-sm text-muted-copy">{description}</p>
                </div>
                {action}
            </CardContent>
        </Card>
    );
}
