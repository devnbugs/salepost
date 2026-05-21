import { Form, Head } from '@inertiajs/react';
import { User, Mail, Lock, Sparkles, LoaderCircle } from 'lucide-react';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import TextLink from '@/components/text-link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { login } from '@/routes';
import { store as registerStore } from '@/routes/register';

export default function Register() {
    return (
        <div className="relative flex flex-col justify-center px-1 py-6">
            <Head title="Create Operator Account" />

            <div className="space-y-6">
                <div className="text-left">
                    <h3 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
                        <Sparkles className="h-5 w-5 text-emerald-500" />
                        Join the Operator Terminal
                    </h3>
                    <p className="mt-1 text-xs text-muted-foreground">
                        Create a secure credential profile to manage sales,
                        purchases, and terminal settings.
                    </p>
                </div>

                <Form {...registerStore.form()} className="flex flex-col gap-5">
                    {({ processing, errors }) => (
                        <div className="grid gap-5">
                            {/* Full Name */}
                            <div className="grid gap-1.5 text-left">
                                <Label
                                    htmlFor="name"
                                    className="flex items-center gap-1.5 text-sm font-semibold"
                                >
                                    <User className="h-4 w-4 text-muted-foreground" />
                                    Full Name
                                </Label>
                                <Input
                                    id="name"
                                    type="text"
                                    name="name"
                                    required
                                    autoFocus
                                    placeholder="Operator Name"
                                    className="focus-visible:ring-emerald-500/20"
                                />
                                <InputError message={errors.name} />
                            </div>

                            {/* Email Address */}
                            <div className="grid gap-1.5 text-left">
                                <Label
                                    htmlFor="email"
                                    className="flex items-center gap-1.5 text-sm font-semibold"
                                >
                                    <Mail className="h-4 w-4 text-muted-foreground" />
                                    Email Address
                                </Label>
                                <Input
                                    id="email"
                                    type="email"
                                    name="email"
                                    required
                                    placeholder="operator@salepost.co"
                                    className="focus-visible:ring-emerald-500/20"
                                />
                                <InputError message={errors.email} />
                            </div>

                            {/* Password */}
                            <div className="grid gap-1.5 text-left">
                                <Label
                                    htmlFor="password"
                                    className="flex items-center gap-1.5 text-sm font-semibold"
                                >
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                    Choose Password
                                </Label>
                                <PasswordInput
                                    id="password"
                                    name="password"
                                    required
                                    placeholder="Minimum 8 characters"
                                    className="focus-visible:ring-emerald-500/20"
                                />
                                <InputError message={errors.password} />
                            </div>

                            {/* Confirm Password */}
                            <div className="grid gap-1.5 text-left">
                                <Label
                                    htmlFor="password_confirmation"
                                    className="flex items-center gap-1.5 text-sm font-semibold"
                                >
                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                    Confirm Password
                                </Label>
                                <PasswordInput
                                    id="password_confirmation"
                                    name="password_confirmation"
                                    required
                                    placeholder="Re-enter password"
                                    className="focus-visible:ring-emerald-500/20"
                                />
                                <InputError
                                    message={errors.password_confirmation}
                                />
                            </div>

                            {/* Register Button */}
                            <Button
                                type="submit"
                                className="h-11 w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:opacity-90"
                                disabled={processing}
                            >
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin text-primary-foreground" />
                                )}
                                Register New Operator
                            </Button>
                        </div>
                    )}
                </Form>

                <div className="space-x-1 pt-2 text-center text-sm text-muted-foreground">
                    <span>Already registered?</span>
                    <TextLink href={login()}>log in</TextLink>
                </div>
            </div>
        </div>
    );
}

Register.layout = {
    title: 'Register New Operator',
    description: 'Create a new operator account for multi-company access.',
};
