import AppShell from '@/components/app-shell';
import FormError from '@/components/form-error';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

export default function CustomersForm({ customer, branches }: any) {
    const { data, setData, post, put, processing, errors } = useForm<any>({
        branch_id: customer?.branch_id ?? branches[0]?.id ?? '',
        name: customer?.name ?? '',
        phone: customer?.phone ?? '',
        email: customer?.email ?? '',
        company_name: customer?.company_name ?? '',
        address: customer?.address ?? '',
        notes: customer?.notes ?? '',
    });

    const submit = (event: any) => {
        event.preventDefault();
        if (customer) {
            put(route('customers.update', customer.id));
            return;
        }
        post(route('customers.store'));
    };

    return (
        <AppShell title={customer ? 'Edit Customer' : 'Add Customer'}>
            <PageHeader title={customer ? 'Edit Customer' : 'Add Customer'} />
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label>Name</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <FormError message={errors.name} />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                        </div>
                        <div>
                            <Label>Company</Label>
                            <Input value={data.company_name} onChange={(e) => setData('company_name', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Address</Label>
                            <Input value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Notes</Label>
                            <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Button disabled={processing}>{customer ? 'Update Customer' : 'Save Customer'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppShell>
    );
}
