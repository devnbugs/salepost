import AppShell from '@/components/app-shell';
import FormError from '@/components/form-error';
import PageHeader from '@/components/page-header';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select } from '@/components/ui/select';
import { useForm } from '@inertiajs/react';

export default function UsersForm({ user, roles, branches }: any) {
    const { data, setData, post, put, processing, errors } = useForm<any>({
        branch_id: user?.branch_id ?? branches[0]?.id ?? '',
        name: user?.name ?? '',
        email: user?.email ?? '',
        phone: user?.phone ?? '',
        job_title: user?.job_title ?? '',
        role: user?.roles?.[0]?.name ?? roles[0] ?? '',
        password: '',
        password_confirmation: '',
    });

    const submit = (event: any) => {
        event.preventDefault();
        if (user) {
            put(route('users.update', user.id));
            return;
        }
        post(route('users.store'));
    };

    return (
        <AppShell title={user ? 'Edit User' : 'Add User'}>
            <PageHeader title={user ? 'Edit User' : 'Add User'} />
            <Card>
                <CardContent className="p-6">
                    <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
                        <div>
                            <Label>Name</Label>
                            <Input value={data.name} onChange={(e) => setData('name', e.target.value)} />
                            <FormError message={errors.name} />
                        </div>
                        <div>
                            <Label>Email</Label>
                            <Input type="email" value={data.email} onChange={(e) => setData('email', e.target.value)} />
                            <FormError message={errors.email} />
                        </div>
                        <div>
                            <Label>Phone</Label>
                            <Input value={data.phone} onChange={(e) => setData('phone', e.target.value)} />
                        </div>
                        <div>
                            <Label>Job Title</Label>
                            <Input value={data.job_title} onChange={(e) => setData('job_title', e.target.value)} />
                        </div>
                        <div>
                            <Label>Role</Label>
                            <Select value={data.role} onChange={(e) => setData('role', e.target.value)}>
                                {roles.map((role: string) => (
                                    <option key={role} value={role}>
                                        {role}
                                    </option>
                                ))}
                            </Select>
                        </div>
                        <div>
                            <Label>Password</Label>
                            <Input type="password" value={data.password} onChange={(e) => setData('password', e.target.value)} />
                        </div>
                        <div>
                            <Label>Confirm Password</Label>
                            <Input
                                type="password"
                                value={data.password_confirmation}
                                onChange={(e) => setData('password_confirmation', e.target.value)}
                            />
                        </div>
                        <div className="md:col-span-2">
                            <Button disabled={processing}>{user ? 'Update User' : 'Create User'}</Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </AppShell>
    );
}
