import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { PageProps } from '@/types';
import { Head } from '@inertiajs/react';
import DeleteUserForm from './Partials/DeleteUserForm';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';
import { Card, CardContent } from '@/components/ui/card';

export default function Edit({
    mustVerifyEmail,
    status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
    return (
        <AppShell title="Profile">
            <Head title="Profile" />
            <PageHeader title="Profile" />

            <div className="mx-auto max-w-7xl space-y-6 pt-6">
                <Card>
                    <CardContent className="pt-6">
                        <UpdateProfileInformationForm
                            mustVerifyEmail={mustVerifyEmail}
                            status={status}
                            className="max-w-xl"
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <UpdatePasswordForm className="max-w-xl" />
                    </CardContent>
                </Card>

                <Card>
                    <CardContent className="pt-6">
                        <DeleteUserForm className="max-w-xl" />
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
