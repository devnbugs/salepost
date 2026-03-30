import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { currency } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function PurchasesIndex({ purchases }: any) {
    return (
        <AppShell title="Purchases">
            <PageHeader
                title="Purchase Intake Register"
                description="Record scrap bought into stock, supplier payments, and linked documents."
                actions={
                    <Link href={route('purchases.create')}>
                        <Button>New Purchase</Button>
                    </Link>
                }
            />
            <div className="grid gap-4">
                {purchases.data.map((purchase: any) => (
                    <Card key={purchase.id}>
                        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <Link href={route('purchases.show', purchase.id)} className="text-lg font-semibold hover:underline">
                                    {purchase.purchase_number}
                                </Link>
                                <p className="text-sm text-muted-copy">{purchase.supplier?.name}</p>
                            </div>
                            <Badge variant={purchase.balance_due > 0 ? 'warning' : 'success'}>
                                {purchase.payment_status}
                            </Badge>
                            <div className="text-right">
                                <p className="font-semibold">{currency(purchase.total_amount)}</p>
                                <p className="text-sm text-muted-copy">{purchase.purchase_date}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AppShell>
    );
}
