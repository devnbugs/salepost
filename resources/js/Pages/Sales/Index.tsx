import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { currency } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SalesIndex({ sales, filters, status_options }: any) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');

    return (
        <AppShell title="Sales">
            <PageHeader
                title="Sales Register"
                description="Draft and completed sales with invoice linkage, balances, and tags."
                actions={
                    <Link href={route('sales.create')}>
                        <Button>Create Sale</Button>
                    </Link>
                }
            />

            <Card className="mb-6">
                <CardContent className="p-5">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get(route('sales.index'), { search, status, from, to });
                        }}
                        className="grid gap-3 md:grid-cols-5"
                    >
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search invoice, customer, sale" />
                        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">All statuses</option>
                            {status_options.map((option: any) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                        <Button type="submit">Filter</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {sales.data.map((sale: any) => (
                    <Card key={sale.id}>
                        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <Link href={route('sales.show', sale.id)} className="text-lg font-semibold hover:underline">
                                    {sale.sale_number}
                                </Link>
                                <p className="text-sm text-muted-copy">{sale.customer?.name ?? 'Walk-in customer'}</p>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                <Badge variant="primary">{sale.status}</Badge>
                                <Badge variant={sale.balance_due > 0 ? 'warning' : 'success'}>
                                    {sale.payment_status}
                                </Badge>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{currency(sale.total_amount)}</p>
                                <p className="text-sm text-muted-copy">{sale.sale_date}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AppShell>
    );
}
