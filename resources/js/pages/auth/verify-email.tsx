import { Form, Head, router } from '@inertiajs/react';
import { MailCheck, LogOut, ArrowRight, LoaderCircle } from 'lucide-react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { logout } from '@/routes';
import { send as verificationSend } from '@/routes/verification';

export default function VerifyEmail({ status }: { status?: string }) {
    const isVerificationSent = status === 'verification-link-sent';

    const handleLogout = () => {
        router.post(
            logout.url(),
            {},
            {
                onSuccess: () => toast.success('Logged out successfully.'),
            },
        );
    };

    return (
        <div className="relative flex flex-col justify-center px-1 py-6">
            <Head title="Verify Email" />

            <div className="space-y-6 text-left">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-emerald-500/10">
                        <MailCheck className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                        Verify Your Email Address
                    </h3>
                    <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                        Thanks for signing up! Before getting started, please
                        verify your email address by clicking on the link we
                        just sent to you.
                    </p>
                </div>

                {isVerificationSent && (
                    <div className="animate-fade-in rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-3 text-center text-xs font-semibold text-emerald-500">
                        A new verification link has been sent to the email
                        address you provided during registration.
                    </div>
                )}

                <div className="space-y-3 pt-2">
                    <Form {...verificationSend.form()}>
                        {({ processing }) => (
                            <Button
                                type="submit"
                                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:opacity-90"
                                disabled={processing}
                            >
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin text-primary-foreground" />
                                )}
                                Resend Verification Email
                                <ArrowRight className="h-4 w-4 text-emerald-500" />
                            </Button>
                        )}
                    </Form>

                    <Button
                        type="button"
                        variant="outline"
                        onClick={handleLogout}
                        className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-input bg-background text-sm font-semibold transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
                    >
                        <LogOut className="h-4 w-4 text-muted-foreground" />
                        Sign Out
                    </Button>
                </div>
            </div>
        </div>
    );
}

VerifyEmail.layout = {
    title: 'Verify Your Email',
    description: 'We need to make sure your operator email is correct.',
};
