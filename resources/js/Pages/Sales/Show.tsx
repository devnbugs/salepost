import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { currency } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function SalesShow({ sale }: any) {
    return (
        <AppShell title={sale.sale_number}>
            <PageHeader
                title={sale.sale_number}
                description={`Customer: ${sale.customer?.name ?? 'Walk-in customer'}`}
                actions={
                    sale.invoice ? (
                        <Link href={route('invoices.show', sale.invoice.id)}>
                            <Button>Open Invoice</Button>
                        </Link>
                    ) : null
                }
            />

            <div className="grid gap-6 md:grid-cols-3">
                <Card>
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground">Total</p>
                        <p className="mt-2 text-2xl font-bold">{currency(sale.total_amount)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-foreground">Amount Paid</p>
                        <p className="mt-2 text-2xl font-bold">{currency(sale.amount_paid)}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="space-y-2 p-5">
                        <Badge variant="primary">{sale.status}</Badge>
                        <Badge variant={sale.balance_due > 0 ? 'warning' : 'success'}>
                            {sale.payment_status}
                        </Badge>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Sale Items</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {sale.items.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between rounded-lg bg-muted px-4 py-3">
                            <div>
                                <p className="font-medium">{item.product?.name}</p>
                                <p className="text-sm text-muted-foreground">
                                    {item.quantity} x {currency(item.unit_price)}
                                </p>
                            </div>
                            <span className="font-semibold">{currency(item.total_amount)}</span>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </AppShell>
    );
}
