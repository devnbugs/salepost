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

export default function CashTransactionsIndex({ transactions, filters, direction_options, payment_methods }: any) {
    const [direction, setDirection] = useState(filters.direction ?? '');
    const [paymentMethod, setPaymentMethod] = useState(filters.payment_method ?? '');
    const [from, setFrom] = useState(filters.from ?? '');
    const [to, setTo] = useState(filters.to ?? '');

    return (
        <AppShell title="Cash Flow">
            <PageHeader
                title="Cash In / Cash Out"
                description="Review inflows, outflows, categories, and payment methods with date filters."
                actions={
                    <Link href={route('cash-transactions.create')}>
                        <Button>Add Cash Entry</Button>
                    </Link>
                }
            />

            <Card className="mb-6">
                <CardContent className="grid gap-3 p-5 md:grid-cols-5">
                    <Select value={direction} onChange={(e) => setDirection(e.target.value)}>
                        <option value="">All directions</option>
                        {direction_options.map((option: any) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                    <Select value={paymentMethod} onChange={(e) => setPaymentMethod(e.target.value)}>
                        <option value="">All methods</option>
                        {payment_methods.map((option: any) => (
                            <option key={option.value} value={option.value}>
                                {option.label}
                            </option>
                        ))}
                    </Select>
                    <Input type="date" value={from} onChange={(e) => setFrom(e.target.value)} />
                    <Input type="date" value={to} onChange={(e) => setTo(e.target.value)} />
                    <Button
                        onClick={() => router.get(route('cash-transactions.index'), { direction, payment_method: paymentMethod, from, to })}
                    >
                        Filter
                    </Button>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {transactions.data.map((transaction: any) => (
                    <Card key={transaction.id}>
                        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-lg font-semibold">{transaction.transaction_number}</p>
                                <p className="text-sm text-muted-copy">{transaction.category_name}</p>
                            </div>
                            <Badge variant={transaction.direction === 'inflow' ? 'success' : 'danger'}>
                                {transaction.direction}
                            </Badge>
                            <div className="text-right">
                                <p className="font-semibold">{currency(transaction.amount)}</p>
                                <p className="text-sm text-muted-copy">{transaction.transaction_date}</p>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AppShell>
    );
}
