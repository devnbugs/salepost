import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { currency } from '@/lib/utils';
import { Link } from '@inertiajs/react';

export default function CustomersShow({ customer }: any) {
    return (
        <AppShell title={customer.name}>
            <PageHeader
                title={customer.name}
                description={customer.company_name ?? 'Customer account overview and transaction history.'}
                actions={
                    <Link href={route('customers.edit', customer.id)}>
                        <Button>Edit</Button>
                    </Link>
                }
            />

            <div className="grid gap-6 lg:grid-cols-3">
                <Card>
                    <CardHeader>
                        <CardTitle>Balance</CardTitle>
                    </CardHeader>
                    <CardContent className="text-2xl font-bold">{currency(customer.balance)}</CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Contact</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p>{customer.phone ?? 'No phone'}</p>
                        <p className="text-muted-copy">{customer.email ?? 'No email'}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Sales & Invoices</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {customer.sales.map((sale: any) => (
                        <div key={sale.id} className="flex items-center justify-between rounded-2xl bg-muted-panel px-4 py-3">
                            <div>
                                <p className="font-medium">{sale.sale_number}</p>
                                <p className="text-sm text-muted-copy">{sale.sale_date}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{currency(sale.total_amount)}</p>
                                <Badge variant={sale.balance_due > 0 ? 'warning' : 'success'}>
                                    {sale.payment_status}
                                </Badge>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </AppShell>
    );
}
