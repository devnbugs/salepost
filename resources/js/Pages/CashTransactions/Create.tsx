import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

export default function CashTransactionsCreate({ categories, customers, suppliers, direction_options, payment_methods }: any) {
    const { data, setData, post, processing } = useForm<any>({
        transaction_date: new Date().toISOString().slice(0, 10),
        direction: 'inflow',
        expense_category_id: '',
        customer_id: '',
        supplier_id: '',
        category_name: '',
        payment_method: 'cash',
        amount: '',
        reference_number: '',
        description: '',
    });

    return (
        <AppShell title="New Cash Entry">
            <PageHeader title="New Cash Entry" />
            <Card>
                <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                    <div>
                        <Label>Date</Label>
                        <Input type="date" value={data.transaction_date} onChange={(e) => setData('transaction_date', e.target.value)} />
                    </div>
                    <div>
                        <Label>Direction</Label>
                        <Select value={data.direction} onChange={(e) => setData('direction', e.target.value)}>
                            {direction_options.map((option: any) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label>Category</Label>
                        <Select value={data.expense_category_id} onChange={(e) => setData('expense_category_id', e.target.value)}>
                            <option value="">Select category</option>
                            {categories.map((category: any) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label>Payment Method</Label>
                        <Select value={data.payment_method} onChange={(e) => setData('payment_method', e.target.value)}>
                            {payment_methods.map((option: any) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label>Customer</Label>
                        <Select value={data.customer_id} onChange={(e) => setData('customer_id', e.target.value)}>
                            <option value="">No customer</option>
                            {customers.map((customer: any) => (
                                <option key={customer.id} value={customer.id}>
                                    {customer.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label>Supplier</Label>
                        <Select value={data.supplier_id} onChange={(e) => setData('supplier_id', e.target.value)}>
                            <option value="">No supplier</option>
                            {suppliers.map((supplier: any) => (
                                <option key={supplier.id} value={supplier.id}>
                                    {supplier.name}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label>Amount</Label>
                        <Input type="number" value={data.amount} onChange={(e) => setData('amount', e.target.value)} />
                    </div>
                    <div>
                        <Label>Reference</Label>
                        <Input value={data.reference_number} onChange={(e) => setData('reference_number', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <Button disabled={processing} onClick={() => post(route('cash-transactions.store'))}>
                            Save Cash Entry
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </AppShell>
    );
}
