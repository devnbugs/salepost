import { Form, Head } from '@inertiajs/react';
import { ShieldAlert, Lock, LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { store as confirmPasswordStore } from '@/routes/password/confirm';

export default function ConfirmPassword() {
    return (
        <div className="relative flex flex-col justify-center px-1 py-6">
            <Head title="Secure Password Confirmation" />

            <div className="space-y-6 text-left">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-amber-500/10">
                        <ShieldAlert className="h-8 w-8 text-amber-500" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                        Secure Area Confirmation
                    </h3>
                    <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                        This is a highly secure operation. Please verify your
                        current operator password before proceeding.
                    </p>
                </div>

                <Form
                    {...confirmPasswordStore.form()}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <div className="grid gap-5">
                            {/* Current Password Field */}
                            <div className="grid gap-1.5 text-left">
                                <Label
                                    htmlFor="password"
                                    className="flex items-center gap-1.5 text-sm font-semibold"
                                >
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                    Confirm Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    autoFocus
                                    placeholder="Enter your current password"
                                    className="focus-visible:ring-amber-500/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Submit Verification */}
                            <Button
                                type="submit"
                                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:opacity-90"
                                disabled={processing}
                            >
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin text-primary-foreground" />
                                )}
                                Confirm Secure Access
                            </Button>
                        </div>
                    )}
                </Form>
            </div>
        </div>
    );
}

ConfirmPassword.layout = {
    title: 'Confirm Secure Password',
    description:
        'Verify your operator password to authorize secure operations.',
};
