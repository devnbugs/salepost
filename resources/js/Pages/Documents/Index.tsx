import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function DocumentsIndex({ documents, document_types }: any) {
    return (
        <AppShell title="Documents">
            <PageHeader
                title="Document Registry"
                description="Central registry for invoices, receipts, proofs, transport documents, and internal files."
                actions={
                    <Link href={route('documents.create')}>
                        <Button>Upload Document</Button>
                    </Link>
                }
            />
            <div className="grid gap-4">
                {documents.data.map((document: any) => (
                    <Card key={document.id}>
                        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <Link href={route('documents.show', document.id)} className="text-lg font-semibold hover:underline">
                                    {document.title}
                                </Link>
                                <p className="text-sm text-muted-copy">{document.reference_number ?? 'No reference'}</p>
                            </div>
                            <Badge variant="primary">{document.document_type}</Badge>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AppShell>
    );
}
