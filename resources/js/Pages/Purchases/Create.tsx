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

export default function PurchasesCreate({ suppliers, products, status_options }: any) {
    const { data, setData, post, processing } = useForm<any>({
        supplier_id: '',
        purchase_date: new Date().toISOString().slice(0, 10),
        status: 'received',
        other_charges: 0,
        description: '',
        notes: '',
        items: [{ product_id: '', quantity: 1, unit_cost: '' }],
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

    const total = data.items.reduce(
        (carry: number, item: any) => carry + Number(item.quantity || 0) * Number(item.unit_cost || 0),
        0,
    ) + Number(data.other_charges || 0);

    return (
        <AppShell title="New Purchase">
            <PageHeader title="New Purchase" />
            <Card>
                <CardContent className="space-y-6 p-6">
                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label>Supplier</Label>
                            <Select value={data.supplier_id} onChange={(e) => setData('supplier_id', e.target.value)}>
                                <option value="">Select supplier</option>
                                {suppliers.map((supplier: any) => (
                                    <option key={supplier.id} value={supplier.id}>
                                        {supplier.name}
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
                    </div>

                    {data.items.map((item: any, index: number) => (
                        <div key={index} className="grid gap-3 rounded-2xl border border-base p-4 md:grid-cols-3">
                            <Select
                                value={item.product_id}
                                onChange={(e) => {
                                    const product = products.find((entry: any) => String(entry.id) === e.target.value);
                                    updateItem(index, 'product_id', e.target.value);
                                    if (product) {
                                        updateItem(index, 'unit_cost', product.cost_price);
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
                            <Input type="number" value={item.quantity} onChange={(e) => updateItem(index, 'quantity', e.target.value)} />
                            <Input type="number" value={item.unit_cost} onChange={(e) => updateItem(index, 'unit_cost', e.target.value)} />
                        </div>
                    ))}

                    <div className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label>Other Charges</Label>
                            <Input type="number" value={data.other_charges} onChange={(e) => setData('other_charges', e.target.value)} />
                        </div>
                        <div className="rounded-2xl bg-muted-panel p-4">
                            <p className="text-sm text-muted-copy">Estimated Total</p>
                            <p className="mt-2 text-2xl font-bold">{currency(total)}</p>
                        </div>
                        <div className="md:col-span-2">
                            <Label>Description</Label>
                            <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Button disabled={processing} onClick={() => post(route('purchases.store'))}>
                                Save Purchase
                            </Button>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </AppShell>
    );
}
