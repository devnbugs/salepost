import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import StatCard from '@/components/stat-card';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { currency } from '@/lib/utils';
import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts';

export default function ReportsIndex({ summary, daily_sales, product_movement, filters }: any) {
    const [from, setFrom] = useState(filters.from);
    const [to, setTo] = useState(filters.to);

    return (
        <AppShell title="Reports">
            <PageHeader
                title="Reports & Analytics"
                description="Daily sales, cash flow, invoice balances, and product movement across the selected period."
                actions={
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get(route('reports.index'), { from, to });
                        }}
                        className="flex flex-col gap-2 sm:flex-row"
                    >
                        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                    </form>
                }
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard label="Sales Total" value={currency(summary.sales_total)} />
                <StatCard label="Cash In" value={currency(summary.cash_in_total)} />
                <StatCard label="Cash Out" value={currency(summary.cash_out_total)} />
                <StatCard label="Profit Estimate" value={currency(summary.profit_estimate)} />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Sales</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={daily_sales}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" fill="#0f766e" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
                <Card>
                    <CardHeader>
                        <CardTitle>Product Movement</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {product_movement.slice(0, 8).map((product: any) => (
                            <div key={product.id} className="flex items-center justify-between rounded-2xl bg-muted-panel px-4 py-3 text-sm">
                                <span>{product.name}</span>
                                <span>
                                    Sold {product.sold_quantity ?? 0} / Bought {product.purchased_quantity ?? 0}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
