import AppShell from '@/components/app-shell';
import PageHeader from '@/components/page-header';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Link, router } from '@inertiajs/react';
import { useState } from 'react';

export default function UsersIndex({ users, filters }: any) {
    const [search, setSearch] = useState(filters.search ?? '');

    return (
        <AppShell title="Users">
            <PageHeader
                title="Users & Roles"
                description="Owner-controlled internal access for managers, cashier staff, sales staff, storekeepers, and viewers."
                actions={
                    <Link href={route('users.create')}>
                        <Button>Add User</Button>
                    </Link>
                }
            />

            <Card className="mb-6">
                <CardContent className="p-5">
                    <form
                        onSubmit={(event) => {
                            event.preventDefault();
                            router.get(route('users.index'), { search });
                        }}
                        className="flex gap-3"
                    >
                        <Input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search users" />
                        <Button type="submit">Search</Button>
                    </form>
                </CardContent>
            </Card>

            <div className="grid gap-4">
                {users.data.map((user: any) => (
                    <Card key={user.id}>
                        <CardContent className="flex flex-col gap-4 p-5 md:flex-row md:items-center md:justify-between">
                            <div>
                                <p className="text-lg font-semibold">{user.name}</p>
                                <p className="text-sm text-muted-copy">{user.email}</p>
                            </div>
                            <div className="flex flex-wrap items-center gap-2">
                                {user.roles.map((role: any) => (
                                    <Badge key={role.id} variant="primary">
                                        {role.name}
                                    </Badge>
                                ))}
                            </div>
                            <div className="flex gap-2">
                                <Link href={route('users.show', user.id)}>
                                    <Button variant="outline">View</Button>
                                </Link>
                                <Link href={route('users.edit', user.id)}>
                                    <Button variant="ghost">Edit</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>
        </AppShell>
    );
}
