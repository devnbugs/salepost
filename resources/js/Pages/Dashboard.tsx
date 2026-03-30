import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import StatCard from '@/components/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { currency } from '@/lib/utils';
import { router } from '@inertiajs/react';
import {
    AlertTriangle,
    ArrowDownCircle,
    ArrowUpCircle,
    Boxes,
    Receipt,
} from 'lucide-react';
import { useState } from 'react';
import {
    Bar,
    BarChart,
    CartesianGrid,
    Line,
    LineChart,
    ResponsiveContainer,
    Tooltip,
    XAxis,
    YAxis,
} from 'recharts';

type DashboardProps = {
    cards: Record<string, number>;
    filters: { from: string; to: string };
    recent_invoices: any[];
    recent_cash_transactions: any[];
    sales_by_day: Array<{ label: string; total: number }>;
    sales_by_product: Array<{ label: string; total: number }>;
    top_customers: Array<{ label: string; total: number }>;
    top_selling_material?: { label: string; total: number } | null;
    low_stock_products: any[];
};

export default function Dashboard(props: DashboardProps) {
    const [from, setFrom] = useState(props.filters.from);
    const [to, setTo] = useState(props.filters.to);

    const submitFilters = (event: any) => {
        event.preventDefault();
        router.get(route('dashboard'), { from, to }, { preserveState: true });
    };

    return (
        <AppShell title="Dashboard">
            <PageHeader
                title="Scrap Operations Dashboard"
                description="Monitor sales, cash movement, invoices, and stock levels across the business."
                actions={
                    <form onSubmit={submitFilters} className="flex flex-col gap-2 sm:flex-row">
                        <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                        <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                        <Button type="submit">Apply</Button>
                    </form>
                }
            />

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
                <StatCard
                    label="Today Sales"
                    value={currency(props.cards.today_sales_total)}
                    icon={<ArrowUpCircle className="h-5 w-5" />}
                />
                <StatCard
                    label="Cash In Today"
                    value={currency(props.cards.cash_in_today)}
                    icon={<ArrowUpCircle className="h-5 w-5" />}
                />
                <StatCard
                    label="Cash Out Today"
                    value={currency(props.cards.cash_out_today)}
                    icon={<ArrowDownCircle className="h-5 w-5" />}
                />
                <StatCard
                    label="Low Stock Alerts"
                    value={props.cards.low_stock_alerts}
                    icon={<AlertTriangle className="h-5 w-5" />}
                />
            </div>

            <div className="mt-6 grid gap-6 xl:grid-cols-[1.4fr_1fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Daily Sales Trend</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <LineChart data={props.sales_by_day}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Line type="monotone" dataKey="total" stroke="#0f766e" strokeWidth={3} />
                            </LineChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Top Materials</CardTitle>
                    </CardHeader>
                    <CardContent className="h-80">
                        <ResponsiveContainer width="100%" height="100%">
                            <BarChart data={props.sales_by_product}>
                                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                                <XAxis dataKey="label" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="total" fill="#f59e0b" radius={[8, 8, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Recent Invoices</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {props.recent_invoices.map((invoice) => (
                            <div
                                key={invoice.id}
                                className="flex items-center justify-between rounded-2xl bg-muted-panel px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium">{invoice.invoice_number}</p>
                                    <p className="text-sm text-muted-copy">
                                        {invoice.customer?.name ?? 'Walk-in customer'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{currency(invoice.total_amount)}</p>
                                    <Badge variant={invoice.balance_due > 0 ? 'warning' : 'success'}>
                                        {invoice.status}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Recent Cash Activity</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {props.recent_cash_transactions.map((transaction) => (
                            <div
                                key={transaction.id}
                                className="flex items-center justify-between rounded-2xl bg-muted-panel px-4 py-3"
                            >
                                <div>
                                    <p className="font-medium">{transaction.transaction_number}</p>
                                    <p className="text-sm text-muted-copy">
                                        {transaction.category_name ?? 'General transaction'}
                                    </p>
                                </div>
                                <div className="text-right">
                                    <p className="font-semibold">{currency(transaction.amount)}</p>
                                    <Badge variant={transaction.direction === 'inflow' ? 'success' : 'danger'}>
                                        {transaction.direction}
                                    </Badge>
                                </div>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Top Customers</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {props.top_customers.map((customer) => (
                            <div key={customer.label} className="flex items-center justify-between rounded-2xl bg-muted-panel px-4 py-3">
                                <span>{customer.label}</span>
                                <span className="font-semibold">{currency(customer.total)}</span>
                            </div>
                        ))}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Low Stock Watchlist</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {props.low_stock_products.map((product) => (
                            <div key={product.id} className="flex items-center justify-between rounded-2xl bg-muted-panel px-4 py-3">
                                <div className="flex items-center gap-3">
                                    <Boxes className="h-4 w-4 text-muted-copy" />
                                    <span>{product.name}</span>
                                </div>
                                <span className="text-sm text-muted-copy">
                                    {product.current_stock} / {product.reorder_level}
                                </span>
                            </div>
                        ))}
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
