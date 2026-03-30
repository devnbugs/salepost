import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { currency } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function InvoicesIndex({ invoices, filters }: any) {
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <AppShell title="Invoices">
            <PageHeader title="Invoices" description="Track generated invoices, balances, and linked sale records." />
            <Card className="mb-6">
                <CardContent className="p-5">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get(route('invoices.index'), { search });
                        }}
                        className="flex gap-3"
                    >
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoice or customer" />
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {invoices.data.map((invoice: any) => (
                    <Card key={invoice.id}>
                        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <Link href={route('invoices.show', invoice.id)} className="text-lg font-semibold hover:underline">
                                    {invoice.invoice_number}
                                </Link>
                                <p className="text-sm text-muted-copy">{invoice.customer?.name ?? 'Walk-in customer'}</p>
                            </div>
                            <div className="flex gap-2">
                                <Badge variant={invoice.balance_due > 0 ? 'warning' : 'success'}>
                                    {invoice.status}
                                </Badge>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{currency(invoice.total_amount)}</p>
                                <p className="text-sm text-muted-copy">{invoice.invoice_date}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AppShell>
    );
}
