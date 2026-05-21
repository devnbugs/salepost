import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Head, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('password.email'));
    };

    return (
        <GuestLayout>
            <Head title="Forgot Password" />

            <p className="mb-4 text-sm text-muted-foreground">
                Forgot your password? No problem. Just let us know your email
                address and we will email you a password reset link that will
                allow you to choose a new one.
            </p>

            {status && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                        {status}
                    </AlertDescription>
                </Alert>
            )}

            <form onSubmit={submit} className="space-y-4">
                <div className="space-y-2">
                    <Input
                        id="email"
                        type="email"
                        name="email"
                        value={data.email}
                        placeholder="Enter your email"
                        autoFocus
                        onChange={(e) => setData('email', e.target.value)}
                    />
                    {errors.email && (
                        <p className="text-sm text-red-600">{errors.email}</p>
                    )}
                </div>

                <Button type="submit" disabled={processing} className="w-full">
                    {processing ? 'Sending...' : 'Email Password Reset Link'}
                </Button>
            </form>
        </GuestLayout>
    );
}
