import { Card, CardContent } from '@/components/ui/card';
import { ReactNode } from 'react';

export default function StatCard({
    label,
    value,
    hint,
    icon,
}: {
    label: string;
    value: ReactNode;
    hint?: string;
    icon?: ReactNode;
}) {
    return (
        <Card>
            <CardContent className="flex items-start justify-between gap-4 p-5">
                <div>
                    <p className="text-sm text-muted-foreground">{label}</p>
                    <p className="mt-2 text-2xl font-bold">{value}</p>
                    {hint ? <p className="mt-1 text-xs text-muted-foreground">{hint}</p> : null}
                </div>
                {icon ? <div className="rounded-lg bg-muted p-3">{icon}</div> : null}
            </CardContent>
        </Card>
    );
}
