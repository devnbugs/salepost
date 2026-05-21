import { Form, Head } from '@inertiajs/react';
import {
    ShieldCheck,
    Keyboard,
    HelpCircle,
    LoaderCircle,
    KeyRound,
} from 'lucide-react';
import { useState } from 'react';
import InputError from '@/components/input-error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { store as twoFactorStore } from '@/routes/two-factor/login';

export default function TwoFactorChallenge() {
    const [recoveryMode, setRecoveryMode] = useState(false);

    return (
        <div className="relative flex flex-col justify-center px-1 py-6">
            <Head title="Two-Factor Security Access" />

            <div className="space-y-6 text-left">
                <div className="flex flex-col items-center text-center">
                    <div className="mb-4 flex h-16 w-16 animate-pulse items-center justify-center rounded-full bg-emerald-500/10">
                        <ShieldCheck className="h-8 w-8 text-emerald-500" />
                    </div>
                    <h3 className="text-xl font-bold tracking-tight text-foreground">
                        Two-Factor Security Code
                    </h3>
                    <p className="mt-2 max-w-sm text-xs leading-relaxed text-muted-foreground">
                        {recoveryMode
                            ? 'Please confirm access by entering one of your emergency recovery codes.'
                            : 'Please confirm access by entering the 6-digit verification code from your authenticator app.'}
                    </p>
                </div>

                <Form
                    {...twoFactorStore.form()}
                    className="flex flex-col gap-5"
                >
                    {({ processing, errors }) => (
                        <div className="grid gap-5">
                            {recoveryMode ? (
                                /* Emergency Recovery Code Input */
                                <div className="animate-fade-in grid gap-1.5 text-left">
                                    <Label
                                        htmlFor="recovery_code"
                                        className="flex items-center gap-1.5 text-sm font-semibold"
                                    >
                                        <KeyRound className="h-4 w-4 text-muted-foreground" />
                                        Recovery Code
                                    </Label>
                                    <Input
                                        id="recovery_code"
                                        type="text"
                                        name="recovery_code"
                                        required
                                        autoFocus
                                        placeholder="xxxx-xxxx-xxxx-xxxx"
                                        className="text-center font-mono tracking-widest uppercase focus-visible:ring-emerald-500/20"
                                    />
                                    <InputError
                                        message={errors.recovery_code}
                                    />
                                </div>
                            ) : (
                                /* 6-Digit Authenticator App Code */
                                <div className="animate-fade-in grid gap-1.5 text-left">
                                    <Label
                                        htmlFor="code"
                                        className="flex items-center gap-1.5 text-sm font-semibold"
                                    >
                                        <Keyboard className="h-4 w-4 text-muted-foreground" />
                                        Authenticator App Code
                                    </Label>
                                    <Input
                                        id="code"
                                        type="text"
                                        name="code"
                                        required
                                        autoFocus
                                        maxLength={6}
                                        inputMode="numeric"
                                        placeholder="000 000"
                                        className="text-center font-mono text-lg tracking-widest focus-visible:ring-emerald-500/20"
                                    />
                                    <InputError message={errors.code} />
                                </div>
                            )}

                            {/* Submit Security Code */}
                            <Button
                                type="submit"
                                className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:opacity-90"
                                disabled={processing}
                            >
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin text-primary-foreground" />
                                )}
                                Verify Security Signature
                            </Button>
                        </div>
                    )}
                </Form>

                <div className="flex justify-center border-t pt-4">
                    <button
                        type="button"
                        onClick={() => setRecoveryMode(!recoveryMode)}
                        className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                    >
                        <HelpCircle className="h-3.5 w-3.5 text-emerald-500" />
                        {recoveryMode
                            ? 'Use an authenticator app code instead'
                            : 'Use an emergency backup recovery code'}
                    </button>
                </div>
            </div>
        </div>
    );
}

TwoFactorChallenge.layout = {
    title: 'Two-Factor Challenge',
    description: 'Verify your identity to authorize operations.',
};
