import AppShell from '@/components/app-shell';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import PageHeader from '@/components/page-header';
import { currency } from '@/lib/utils';
import { useForm } from '@inertiajs/react';

export default function InvoicesShow({ invoice, business }: any) {
    const paymentForm = useForm<any>({
        invoice_id: invoice.id,
        payment_date: new Date().toISOString().slice(0, 10),
        method: 'cash',
        amount: '',
        reference_number: '',
        notes: '',
    });

    return (
        <AppShell title={invoice.invoice_number}>
            <PageHeader
                title={invoice.invoice_number}
                description={`${business.business_name} invoice record`}
                actions={
                    <div className="flex gap-2">
                        <Button variant="outline" onClick={() => window.print()}>
                            Print
                        </Button>
                        <Button onClick={() => window.location.assign(route('invoices.download', invoice.id))}>
                            Download PDF
                        </Button>
                    </div>
                }
            />

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
                <Card>
                    <CardHeader>
                        <CardTitle>Invoice Items</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        {invoice.sale.items.map((item: any) => (
                            <div key={item.id} className="flex items-center justify-between rounded-2xl bg-muted-panel px-4 py-3">
                                <div>
                                    <p className="font-medium">{item.product?.name}</p>
                                    <p className="text-sm text-muted-copy">{item.quantity} units</p>
                                </div>
                                <span className="font-semibold">{currency(item.total_amount)}</span>
                            </div>
                        ))}
                        <div className="rounded-2xl border border-base p-4">
                            <div className="flex justify-between">
                                <span>Total</span>
                                <span className="font-semibold">{currency(invoice.total_amount)}</span>
                            </div>
                            <div className="mt-2 flex justify-between text-muted-copy">
                                <span>Balance</span>
                                <span>{currency(invoice.balance_due)}</span>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Record Payment</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div>
                            <Label>Amount</Label>
                            <Input
                                type="number"
                                value={paymentForm.data.amount}
                                onChange={(e) => paymentForm.setData('amount', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Payment Date</Label>
                            <Input
                                type="date"
                                value={paymentForm.data.payment_date}
                                onChange={(e) => paymentForm.setData('payment_date', e.target.value)}
                            />
                        </div>
                        <div>
                            <Label>Reference Number</Label>
                            <Input
                                value={paymentForm.data.reference_number}
                                onChange={(e) => paymentForm.setData('reference_number', e.target.value)}
                            />
                        </div>
                        <Button onClick={() => paymentForm.post(route('payments.store'))}>
                            Save Payment
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
