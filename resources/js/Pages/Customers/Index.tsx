import AppShell from '@/components/app-shell';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { currency } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function CustomersIndex({ customers, filters, stats }: any) {
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <AppShell title="Customers">
            <PageHeader
                title="Customers"
                description="Manage customer balances, sales history, and invoice exposure."
                actions={
                    <Link href={route('customers.create')}>
                        <Button>Add Customer</Button>
                    </Link>
                }
            />

            <div className="mb-6 grid gap-4 md:grid-cols-2">
                <Card>
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-copy">Total Customers</p>
                        <p className="mt-2 text-2xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-copy">Outstanding Balance</p>
                        <p className="mt-2 text-2xl font-bold">{currency(stats.outstanding_balance)}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardContent className="p-5">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get(route('customers.index'), { search });
                        }}
                        className="flex gap-3"
                    >
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search customers" />
                        <Button type="submit">Search</Button>
                    </form>
                </CardContent>
            </Card>

            {customers.data.length === 0 ? (
                <EmptyState
                    title="No customers yet"
                    description="Create a customer to link sales, invoices, and payments."
                />
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {customers.data.map((customer: any) => (
                        <Card key={customer.id}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Link href={route('customers.show', customer.id)} className="text-lg font-semibold hover:underline">
                                            {customer.name}
                                        </Link>
                                        <p className="text-sm text-muted-copy">{customer.phone ?? customer.email}</p>
                                    </div>
                                    <span className="text-sm font-semibold">{currency(customer.balance)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </AppShell>
    );
}
