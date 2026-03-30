import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { currency } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function SuppliersShow({ supplier }: any) {
    return (
        <AppShell title={supplier.name}>
            <PageHeader
                title={supplier.name}
                description="Supplier account, intake records, and linked payments."
                actions={
                    <Link href={route('suppliers.edit', supplier.id)}>
                        <Button>Edit</Button>
                    </Link>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>Purchases</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {supplier.purchases.map((purchase: any) => (
                        <div key={purchase.id} className="flex items-center justify-between rounded-2xl bg-muted-panel px-4 py-3">
                            <div>
                                <p className="font-medium">{purchase.purchase_number}</p>
                                <p className="text-sm text-muted-copy">{purchase.purchase_date}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{currency(purchase.total_amount)}</p>
                                <Badge variant={purchase.balance_due > 0 ? 'warning' : 'success'}>
                                    {purchase.payment_status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </AppShell>
    );
}
