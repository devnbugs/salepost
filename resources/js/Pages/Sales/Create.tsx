import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { currency } from '@/lib/utils';
import { useForm } from '@inertiajs/react';

export default function SalesCreate({ customers, products, status_options }: any) {
    const { data, setData, post, processing } = useForm<any>({
        customer_id: '',
        sale_date: new Date().toISOString().slice(0, 10),
        due_date: new Date().toISOString().slice(0, 10),
        status: 'completed',
        transport_fee: 0,
        other_charges: 0,
        description: '',
        notes: '',
        items: [{ product_id: '', quantity: 1, unit_price: '', discount_amount: 0 }],
        payment: {
            amount: '',
            payment_date: new Date().toISOString().slice(0, 10),
            method: 'cash',
            reference_number: '',
            notes: '',
        },
    });

    const updateItem = (index: number, field: string, value: string | number) => {
        const items = [...data.items];
        items[index] = { ...items[index], [field]: value };
        setData('items', items);
    };

    const addItem = () => {
        setData('items', [...data.items, { product_id: '', quantity: 1, unit_price: '', discount_amount: 0 }]);
    };

    const removeItem = (index: number) => {
        setData(
            'items',
            data.items.filter((_: unknown, itemIndex: number) => itemIndex !== index),
        );
    };

    const total = data.items.reduce((carry: number, item: any) => {
        return carry + Number(item.quantity || 0) * Number(item.unit_price || 0) - Number(item.discount_amount || 0);
    }, 0) + Number(data.transport_fee || 0) + Number(data.other_charges || 0);

    return (
        <AppShell title="Create Sale">
            <PageHeader title="Create Sale" description="Register a draft or completed sale with multiple materials and payment details." />
            <Card>
                <CardContent className="space-y-6 p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label>Customer</Label>
                            <Select value={data.customer_id} onChange={(e) => setData('customer_id', e.target.value)}>
                                <option value="">Walk-in customer</option>
                                {customers.map((customer: any) => (
                                    <option key={customer.id} value={customer.id}>
                                        {customer.name}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label>Status</Label>
                            <Select value={data.status} onChange={(e) => setData('status', e.target.value)}>
                                {status_options.map((option: any) => (
                                    <option key={option.value} value={option.value}>
                                        {option.label}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label>Sale Date</Label>
                            <Input type="date" value={data.sale_date} onChange={(e) => setData('sale_date', e.target.value)} />
                        </div>
                        <div>
                            <Label>Due Date</Label>
                            <Input type="date" value={data.due_date} onChange={(e) => setData('due_date', e.target.value)} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <h3 className="text-lg font-semibold">Items</h3>
                            <Button type="button" variant="outline" onClick={addItem}>
                                Add Item
                            </Button>
                        </div>
                        {data.items.map((item: any, index: number) => (
                            <div key={index} className="grid gap-3 rounded-2xl border border-base p-4 md:grid-cols-5">
                                <Select
                                    value={item.product_id}
                                    onChange={(e) => {
                                        const product = products.find((entry: any) => String(entry.id) === e.target.value);
                                        updateItem(index, 'product_id', e.target.value);
                                        if (product) {
                                            updateItem(index, 'unit_price', product.selling_price);
                                        }
                                    }}
                                >
                                    <option value="">Select material</option>
                                    {products.map((product: any) => (
                                        <option key={product.id} value={product.id}>
                                            {product.name}
                                        </option>
                                    ))}
                                </Select>
                                <Input
                                    type="number"
                                    value={item.quantity}
                                    onChange={(e) => updateItem(index, 'quantity', e.target.value)}
                                    placeholder="Qty"
                                />
                                <Input
                                    type="number"
                                    value={item.unit_price}
                                    onChange={(e) => updateItem(index, 'unit_price', e.target.value)}
                                    placeholder="Rate"
                                />
                                <Input
                                    type="number"
                                    value={item.discount_amount}
                                    onChange={(e) => updateItem(index, 'discount_amount', e.target.value)}
                                    placeholder="Discount"
                                />
                                <Button type="button" variant="ghost" onClick={() => removeItem(index)}>
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label>Transport Fee</Label>
                            <Input type="number" value={data.transport_fee} onChange={(e) => setData('transport_fee', e.target.value)} />
                        </div>
                        <div>
                            <Label>Other Charges</Label>
                            <Input type="number" value={data.other_charges} onChange={(e) => setData('other_charges', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Description</Label>
                            <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Notes</Label>
                            <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                        </div>
                    </div>

                    <Card className="bg-muted-panel">
                        <CardContent className="grid gap-4 p-5 md:grid-cols-3">
                            <div>
                                <Label>Initial Payment</Label>
                                <Input
                                    type="number"
                                    value={data.payment.amount}
                                    onChange={(e) => setData('payment', { ...data.payment, amount: e.target.value })}
                                />
                            </div>
                            <div>
                                <Label>Payment Method</Label>
                                <Select
                                    value={data.payment.method}
                                    onChange={(e) => setData('payment', { ...data.payment, method: e.target.value })}
                                >
                                    <option value="cash">Cash</option>
                                    <option value="bank_transfer">Bank Transfer</option>
                                    <option value="pos">POS</option>
                                </Select>
                            </div>
                            <div className="rounded-2xl bg-panel p-4">
                                <p className="text-sm text-muted-copy">Estimated Total</p>
                                <p className="mt-2 text-2xl font-bold">{currency(total)}</p>
                            </div>
                        </CardContent>
                    </Card>

                    <Button disabled={processing} onClick={() => post(route('sales.store'))}>
                        Save Sale
                    </Button>
                </CardContent>
            </Card>
        </AppShell>
    );
}
