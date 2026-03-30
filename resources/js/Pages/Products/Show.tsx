import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { currency } from '@/lib/utils';
import { Link, useForm } from '@inertiajs/react';

export default function ProductsShow({ product }: any) {
    const { data, setData, post, processing } = useForm({
        quantity: 0,
        type: 'correction',
        notes: '',
    });

    const submit = (event: any) => {
        event.preventDefault();
        post(route('products.adjust-stock', product.id));
    };

    return (
        <AppShell title={product.name}>
            <PageHeader
                title={product.name}
                description={product.description ?? 'Scrap material details, stock movement, and related transactions.'}
                actions={
                    <Link href={route('products.edit', product.id)}>
                        <Button>Edit</Button>
                    </Link>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Overview</CardTitle>
                    </CardHeader>
                    <CardContent className="grid gap-4 md:grid-cols-2">
                        <div className="rounded-2xl bg-muted-panel p-4">
                            <p className="text-sm text-muted-copy">Selling Price</p>
                            <p className="mt-1 text-xl font-semibold">{currency(product.selling_price)}</p>
                        </div>
                        <div className="rounded-2xl bg-muted-panel p-4">
                            <p className="text-sm text-muted-copy">Current Stock</p>
                            <p className="mt-1 text-xl font-semibold">
                                {product.current_stock} {product.unit_of_measure}
                            </p>
                        </div>
                        <div className="rounded-2xl bg-muted-panel p-4">
                            <p className="text-sm text-muted-copy">Reorder Level</p>
                            <p className="mt-1 text-xl font-semibold">{product.reorder_level}</p>
                        </div>
                        <div className="rounded-2xl bg-muted-panel p-4">
                            <p className="text-sm text-muted-copy">Status</p>
                            <Badge variant={product.current_stock <= product.reorder_level ? 'warning' : 'primary'}>
                                {product.status}
                            </Badge>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Quick Stock Adjustment</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={submit} className="space-y-3">
                            <input
                                className="border-base bg-panel w-full rounded-xl border px-3 py-2"
                                type="number"
                                value={data.quantity}
                                onChange={(e) => setData('quantity', Number(e.target.value))}
                            />
                            <select
                                className="border-base bg-panel w-full rounded-xl border px-3 py-2"
                                value={data.type}
                                onChange={(e) => setData('type', e.target.value)}
                            >
                                <option value="correction">Correction</option>
                                <option value="adjustment_in">Adjustment In</option>
                                <option value="adjustment_out">Adjustment Out</option>
                            </select>
                            <textarea
                                className="border-base bg-panel min-h-[100px] w-full rounded-xl border px-3 py-2"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Reason for adjustment"
                            />
                            <Button disabled={processing}>Post Adjustment</Button>
                        </form>
                    </CardContent>
                </Card>
            </div>

            <Card className="mt-6">
                <CardHeader>
                    <CardTitle>Stock Movements</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    {product.stock_movements.map((movement: any) => (
                        <div key={movement.id} className="flex items-center justify-between rounded-2xl bg-muted-panel px-4 py-3 text-sm">
                            <div>
                                <p className="font-medium">{movement.type}</p>
                                <p className="text-muted-copy">{movement.notes}</p>
                            </div>
                            <div className="text-right">
                                <p className="font-semibold">{movement.quantity}</p>
                                <p className="text-muted-copy">{movement.movement_date}</p>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </AppShell>
    );
}
