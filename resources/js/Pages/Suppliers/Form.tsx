import AppShell from '@/components/app-shell';
import FormError from '@/components/form-error';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

export default function SuppliersForm({ supplier, branches }: any) {
    const { data, setData, post, put, processing, errors } = useForm<any>({
        branch_id: supplier?.branch_id ?? branches[0]?.id ?? '',
        name: supplier?.name ?? '',
        phone: supplier?.phone ?? '',
        email: supplier?.email ?? '',
        address: supplier?.address ?? '',
        notes: supplier?.notes ?? '',
    });

    const submit = (event: any) => {
        event.preventDefault();
        if (supplier) {
            put(route('suppliers.update', supplier.id));
            return;
        }
        post(route('suppliers.store'));
    };

    return (
        <AppShell title={supplier ? 'Edit Supplier' : 'Add Supplier'}>
            <PageHeader title={supplier ? 'Edit Supplier' : 'Add Supplier'} />
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
                        <div className="md:col-span-2">
                            <Label>Address</Label>
                            <Input value={data.address} onChange={(e) => setData('address', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Label>Notes</Label>
                            <Textarea value={data.notes} onChange={(e) => setData('notes', e.target.value)} />
                        </div>
                        <div className="md:col-span-2">
                            <Button disabled={processing}>{supplier ? 'Update Supplier' : 'Save Supplier'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppShell>
    );
}
