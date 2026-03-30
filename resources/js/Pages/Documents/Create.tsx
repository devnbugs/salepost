import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from '@inertiajs/react';

export default function DocumentsCreate({ document_types, customers, suppliers, sales, purchases, invoices, cashTransactions }: any) {
    const { data, setData, post, processing } = useForm<any>({
        title: '',
        document_type: document_types[0]?.value ?? 'miscellaneous',
        reference_number: '',
        customer_id: '',
        supplier_id: '',
        sale_id: '',
        purchase_id: '',
        invoice_id: '',
        cash_transaction_id: '',
        document_date: new Date().toISOString().slice(0, 10),
        expiry_date: '',
        description: '',
        file: null,
    });

    return (
        <AppShell title="Upload Document">
            <PageHeader title="Upload Document" />
            <Card>
                <CardContent className="grid gap-4 p-6 md:grid-cols-2">
                    <div>
                        <Label>Title</Label>
                        <Input value={data.title} onChange={(e) => setData('title', e.target.value)} />
                    </div>
                    <div>
                        <Label>Type</Label>
                        <Select value={data.document_type} onChange={(e) => setData('document_type', e.target.value)}>
                            {document_types.map((option: any) => (
                                <option key={option.value} value={option.value}>
                                    {option.label}
                                </option>
                            ))}
                        </Select>
                    </div>
                    <div>
                        <Label>Reference Number</Label>
                        <Input value={data.reference_number} onChange={(e) => setData('reference_number', e.target.value)} />
                    </div>
                    <div>
                        <Label>Document Date</Label>
                        <Input type="date" value={data.document_date} onChange={(e) => setData('document_date', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <Label>Description</Label>
                        <Textarea value={data.description} onChange={(e) => setData('description', e.target.value)} />
                    </div>
                    <div className="md:col-span-2">
                        <Label>File</Label>
                        <Input type="file" onChange={(e) => setData('file', e.target.files?.[0] ?? null)} />
                    </div>
                    <div className="md:col-span-2">
                        <Button disabled={processing} onClick={() => post(route('documents.store'), { forceFormData: true })}>
                            Upload Document
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </AppShell>
    );
}
