import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { currency } from '@/lib/utils';

export default function PurchasesShow({ purchase }: any) {
    return (
        <AppShell title={purchase.purchase_number}>
            <PageHeader title={purchase.purchase_number} description={`Supplier: ${purchase.supplier?.name ?? 'Unassigned supplier'}`} />

            <Card>
                <CardHeader>
                    <CardTitle>Purchase Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {purchase.items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between rounded-2xl bg-muted-panel px-4 py-3">
                            <div>
                                <p className="font-medium">{item.product?.name}</p>
                                <p className="text-sm text-muted-copy">{item.quantity}</p>
                            </div>
                            <span className="font-semibold">{currency(item.total_cost)}</span>
                        </div>
                    ))}
                    <div className="flex items-center justify-between rounded-2xl border border-base p-4">
                        <span>Total</span>
                        <div className="text-right">
                            <p className="font-semibold">{currency(purchase.total_amount)}</p>
                            <Badge variant={purchase.balance_due > 0 ? 'warning' : 'success'}>
                                {purchase.payment_status}
                            </Badge>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AppShell>
    );
}
