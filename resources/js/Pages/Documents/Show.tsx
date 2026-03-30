import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function DocumentsShow({ document }: any) {
    return (
        <AppShell title={document.title}>
            <PageHeader
                title={document.title}
                description={document.reference_number ?? 'Registered document'}
                actions={
                    <Button onClick={() => window.location.assign(route('documents.download', document.id))}>
                        Download
                    </Button>
                }
            />

            <Card>
                <CardHeader>
                    <CardTitle>Document Details</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                    <p>Type: {document.document_type}</p>
                    <p>File Name: {document.file_name}</p>
                    <p>Uploaded By: {document.uploader?.name}</p>
                    <p>{document.description}</p>
                </CardContent>
            </Card>
        </AppShell>
    );
}
