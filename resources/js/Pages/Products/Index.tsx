import AppShell from '@/components/app-shell';
import EmptyState from '@/components/empty-state';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Select } from '@/components/ui/select';
import { currency } from '@/lib/utils';
import { Head, Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function ProductsIndex({
    products,
    filters,
    categories,
    stats,
    status_options,
}: any) {
    const [search, setSearch] = useState(filters.search ?? '');
    const [status, setStatus] = useState(filters.status ?? '');
    const [categoryId, setCategoryId] = useState(filters.category_id ?? '');

    const submit = (event: any) => {
        event.preventDefault();
        router.get(route('products.index'), {
            search,
            status,
            category_id: categoryId,
        });
    };

    return (
        <AppShell title="Materials">
            <PageHeader
                title="Material Register"
                description="Track scrap materials, prices, stock levels, and tags."
                actions={
                    <Link href={route('products.create')}>
                        <Button>Add Material</Button>
                    </Link>
                }
            />

            <div className="mb-6 grid gap-4 md:grid-cols-3">
                <Card>
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-copy">Total Materials</p>
                        <p className="mt-2 text-2xl font-bold">{stats.total}</p>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-5">
                        <p className="text-sm text-muted-copy">Low Stock</p>
                        <p className="mt-2 text-2xl font-bold">{stats.low_stock}</p>
                    </CardContent>
                </Card>
            </div>

            <Card className="mb-6">
                <CardContent className="p-5">
                    <form onSubmit={submit} className="grid gap-3 md:grid-cols-4">
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search material" />
                        <Select value={status} onChange={(e) => setStatus(e.target.value)}>
                            <option value="">All statuses</option>
                            {status_options.map((option: any) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                        <Select value={categoryId} onChange={(e) => setCategoryId(e.target.value)}>
                            <option value="">All categories</option>
                            {categories.map((category: any) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                        <Button type="submit">Filter</Button>
                    </form>
                </CardContent>
            </Card>

            {products.data.length === 0 ? (
                <EmptyState
                    title="No materials yet"
                    description="Create your first scrap material to start tracking prices and stock."
                    action={
                        <Link href={route('products.create')}>
                            <Button>Add Material</Button>
                        </Link>
                    }
                />
            ) : (
                <div className="grid gap-4 lg:grid-cols-2">
                    {products.data.map((product: any) => (
                        <Card key={product.id}>
                            <CardContent className="space-y-4 p-5">
                                <div className="flex items-start justify-between">
                                    <div>
                                        <Link href={route('products.show', product.id)} className="text-lg font-semibold hover:underline">
                                            {product.name}
                                        </Link>
                                        <p className="text-sm text-muted-copy">{product.slug}</p>
                                    </div>
                                    <Badge variant={product.current_stock <= product.reorder_level ? 'warning' : 'primary'}>
                                        {product.status}
                                    </Badge>
                                </div>
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div className="rounded-2xl bg-muted-panel p-3">
                                        <p className="text-muted-copy">Selling Price</p>
                                        <p className="mt-1 font-semibold">{currency(product.selling_price)}</p>
                                    </div>
                                    <div className="rounded-2xl bg-muted-panel p-3">
                                        <p className="text-muted-copy">Current Stock</p>
                                        <p className="mt-1 font-semibold">
                                            {product.current_stock} {product.unit_of_measure}
                                        </p>
                                    </div>
                                </div>
                                <div className="flex gap-2">
                                    <Link href={route('products.show', product.id)}>
                                        <Button variant="outline">View</Button>
                                    </Link>
                                    <Link href={route('products.edit', product.id)}>
                                        <Button variant="ghost">Edit</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}
        </AppShell>
    );
}
