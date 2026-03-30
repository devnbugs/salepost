import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Link } from '@inertiajs/react';

export default function UsersShow({ user }: any) {
    return (
        <AppShell title={user.name}>
            <PageHeader
                title={user.name}
                description="User role assignment and account profile."
                actions={
                    <Link href={route('users.edit', user.id)}>
                        <Button>Edit</Button>
                    </Link>
                }
            />

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>Profile</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <p>{user.email}</p>
                        <p className="text-muted-copy">{user.job_title ?? 'No job title'}</p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Roles & Permissions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                        <div className="flex flex-wrap gap-2">
                            {user.roles.map((role: any) => (
                                <Badge key={role.id} variant="primary">
                                    {role.name}
                                </Badge>
                            ))}
                        </div>
                        <div className="flex flex-wrap gap-2">
                            {user.permissions.map((permission: any) => (
                                <Badge key={permission.id} variant="default">
                                    {permission.name}
                                </Badge>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppShell>
    );
}
