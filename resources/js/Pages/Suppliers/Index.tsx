import AppShell from '@/components/app-shell';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { currency } from '@/lib/utils';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function SuppliersIndex({ suppliers, filters, stats }: any) {
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <AppShell title="Suppliers">
            <PageHeader
                title="Suppliers"
                description="Track scrap intake partners, purchase history, and outstanding payables."
                actions={
                    <Link href={route('suppliers.create')}>
                        <Button>Add Supplier</Button>
                    </Link>
                }
            />

            <div className="mb-6 grid gap-4 md:grid-cols-2">
                <Card>
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-copy">Total Suppliers</p>
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
                            router.get(route('suppliers.index'), { search });
                        }}
                        className="flex gap-3"
                    >
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search suppliers" />
                        <Button type="submit">Search</Button>
                    </form>
                </CardContent>
            </Card>

            {suppliers.data.length === 0 ? (
                <EmptyState
                    title="No suppliers yet"
                    description="Create a supplier to link purchases and intake records."
                />
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {suppliers.data.map((supplier: any) => (
                        <Card key={supplier.id}>
                            <CardContent className="p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Link href={route('suppliers.show', supplier.id)} className="text-lg font-semibold hover:underline">
                                            {supplier.name}
                                        </Link>
                                        <p className="text-sm text-muted-copy">{supplier.phone ?? supplier.email}</p>
                                    </div>
                                    <span className="text-sm font-semibold">{currency(supplier.balance)}</span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </AppShell>
    );
}
