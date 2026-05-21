import { Form, Head, router } from '@inertiajs/react';
import { signInWithPopup } from 'firebase/auth';
import {
    ArrowLeft,
    Key,
    Sparkles,
    Mail,
    Lock,
} from 'lucide-react';
import { useState } from 'react';
import { toast } from 'sonner';
import InputError from '@/components/input-error';
import PasswordInput from '@/components/password-input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { auth, googleProvider } from '@/lib/firebase';
import { store } from '@/routes/login';
import { email } from '@/routes/password';

type Branch = {
    id: number;
    name: string;
    code: string;
};

type Props = {
    status?: string;
    canResetPassword: boolean;
    branches?: Branch[];
};

export default function Login({
    status,
    canResetPassword,
}: Props) {
    const [viewMode, setViewMode] = useState<'login' | 'reset_password'>(
        'login',
    );
    const [isGoogleAuthenticating, setIsGoogleAuthenticating] = useState(false);
    const [googleStep, setGoogleStep] = useState('');



    // Handle Firebase Google Login
    const handleGoogleLogin = async () => {
        setIsGoogleAuthenticating(true);
        setGoogleStep(
            'Initializing connection with Google Account Services...',
        );
        toast.info('Connecting to Google Auth...');

        try {
            // 1. Popup Firebase Google Auth
            setGoogleStep('Awaiting credentials signature in secure window...');
            const result = await signInWithPopup(auth, googleProvider);
            const user = result.user;

            setGoogleStep(
                'Google identity approved. Syncing internal secure session...',
            );
            toast.success(`Google Identity verified: ${user.email}`);

            // 2. Transmit to backend for local session creation
            router.post(
                '/auth/firebase-google',
                {
                    email: user.email,
                    name:
                        user.displayName ||
                        user.email?.split('@')[0] ||
                        'Operator',
                    google_id: user.uid,
                    branch_id: null,
                    new_company_name: null,
                },
                {
                    onSuccess: () => {
                        toast.success(
                            'Access approved. Entering terminal deck...',
                            { duration: 3000 },
                        );
                    },
                    onError: (errors) => {
                        setIsGoogleAuthenticating(false);
                        const errMsg = Object.values(errors).join(', ');
                        toast.error(
                            'Sync failed: ' +
                                (errMsg || 'Session registration rejected.'),
                        );
                    },
                    onFinish: () => {
                        setIsGoogleAuthenticating(false);
                    },
                },
            );
        } catch (error: any) {
            setIsGoogleAuthenticating(false);
            console.error('Firebase Auth Error:', error);
            toast.error('Firebase Auth Failed', {
                description:
                    error.message ||
                    'The authorization window was closed or interrupted.',
            });
        }
    };

    return (
        <div className="relative flex min-h-[500px] flex-col justify-center px-1 py-6">
            <Head title={viewMode === 'login' ? 'Log in' : 'Reset Password'} />

            {/* Premium Handshake Overlay */}
            {isGoogleAuthenticating && (
                <div className="animate-fade-in absolute inset-0 z-50 flex flex-col items-center justify-center rounded-3xl bg-background/95 p-6 text-center backdrop-blur-md transition-all duration-300">
                    <div className="relative mb-6">
                        <div className="h-16 w-16 animate-spin rounded-full border-4 border-emerald-500/20 border-t-emerald-500" />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 transform">
                            <svg
                                className="h-6 w-6 animate-pulse"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                        </div>
                    </div>

                    <h3 className="mb-2 text-lg font-bold">
                        Google Active Handshake
                    </h3>
                    <p className="h-12 max-w-xs animate-pulse font-mono text-xs text-emerald-500 text-muted-foreground">
                        {googleStep}
                    </p>
                </div>
            )}

            {/* CARD VIEW SWITCHER */}
            {viewMode === 'login' ? (
                /* 1. CREDENTIALS LOGIN FLOW */
                <div className="space-y-6">
                    <Form
                        {...store.form()}
                        resetOnSuccess={['password']}
                        className="flex flex-col gap-5"
                    >
                        {({ processing, errors }) => {
                            return (
                                <>

                                    <div className="grid gap-5">
                                        {/* Email */}
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
                                                autoFocus
                                                tabIndex={1}
                                                autoComplete="email"
                                                placeholder="email@example.com"
                                                className="focus-visible:ring-emerald-500/20"
                                            />
                                            <InputError
                                                message={errors.email}
                                            />
                                        </div>

                                        {/* Password */}
                                        <div className="grid gap-1.5 text-left">
                                            <div className="flex items-center justify-between">
                                                <Label
                                                    htmlFor="password"
                                                    className="flex items-center gap-1.5 text-sm font-semibold"
                                                >
                                                    <Lock className="h-4 w-4 text-muted-foreground" />
                                                    Password
                                                </Label>
                                                {canResetPassword && (
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            setViewMode(
                                                                'reset_password',
                                                            )
                                                        }
                                                        className="cursor-pointer text-xs font-bold text-emerald-500 transition-colors hover:underline"
                                                        tabIndex={5}
                                                    >
                                                        Forgot Password?
                                                    </button>
                                                )}
                                            </div>
                                            <PasswordInput
                                                id="password"
                                                name="password"
                                                required
                                                tabIndex={2}
                                                autoComplete="current-password"
                                                placeholder="Password"
                                                className="focus-visible:ring-emerald-500/20"
                                            />
                                            <InputError
                                                message={errors.password}
                                            />
                                        </div>

                                        {/* Remember Me */}
                                        <div className="flex items-center space-x-2.5 py-1 text-left">
                                            <Checkbox
                                                id="remember"
                                                name="remember"
                                                tabIndex={3}
                                                className="border-input data-[state=checked]:bg-emerald-500 data-[state=checked]:text-black"
                                            />
                                            <Label
                                                htmlFor="remember"
                                                className="cursor-pointer text-xs font-medium text-muted-foreground select-none"
                                            >
                                                Keep me logged in on this device
                                            </Label>
                                        </div>

                                        {/* Submit */}
                                        <Button
                                            type="submit"
                                            className="h-11 w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:opacity-90"
                                            tabIndex={4}
                                            disabled={processing}
                                            data-test="login-button"
                                        >
                                            {processing && (
                                                <Spinner className="text-primary-foreground" />
                                            )}
                                            <Sparkles className="mr-1.5 h-4 w-4 text-emerald-500" />
                                            Sign In with Credentials
                                        </Button>
                                    </div>
                                </>
                            );
                        }}
                    </Form>

                    {/* Social OAuth / Passkeys Integrations Block */}
                    <div className="space-y-4 pt-2">
                        <div className="relative flex items-center justify-center">
                            <div className="absolute inset-0 flex items-center">
                                <span className="w-full border-t" />
                            </div>
                            <span className="relative bg-background px-3 text-[10px] font-bold tracking-widest text-muted-foreground uppercase">
                                Or Secure OAuth
                            </span>
                        </div>

                        {/* Google Button */}
                        <Button
                            type="button"
                            onClick={handleGoogleLogin}
                            variant="outline"
                            className="flex h-11 w-full cursor-pointer items-center justify-center gap-2 rounded-lg border-input bg-background text-sm font-semibold transition-all duration-300 hover:bg-accent hover:text-accent-foreground"
                        >
                            <svg
                                className="h-4 w-4 shrink-0"
                                viewBox="0 0 24 24"
                            >
                                <path
                                    fill="#4285F4"
                                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                                />
                                <path
                                    fill="#34A853"
                                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                                />
                                <path
                                    fill="#FBBC05"
                                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                                />
                                <path
                                    fill="#EA4335"
                                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                                />
                            </svg>
                            <span>Sign in with Google Account</span>
                        </Button>
                    </div>
                </div>
            ) : (
                /* 2. INLINE RESET PASSWORD BLOCK FLOW */
                <div className="animate-fade-in space-y-6 text-left transition-all duration-300">
                    <div className="mb-4 space-y-2">
                        <h3 className="flex items-center gap-2 text-lg font-bold">
                            <Key className="h-5 w-5 text-emerald-500" />
                            Reset Password Request
                        </h3>
                        <p className="text-xs leading-relaxed text-muted-foreground">
                            No redirects required. Provide your email below and
                            we will trigger the secure password broker to send
                            you a verification recovery link.
                        </p>
                    </div>

                    <Form {...email.form()} resetOnSuccess={['email']}>
                        {({ processing, errors }) => (
                            <div className="space-y-4">
                                <div className="grid gap-1.5">
                                    <Label
                                        htmlFor="reset_email"
                                        className="text-xs font-semibold"
                                    >
                                        Email Address
                                    </Label>
                                    <Input
                                        id="reset_email"
                                        type="email"
                                        name="email"
                                        required
                                        autoFocus
                                        placeholder="email@example.com"
                                        className="focus-visible:ring-emerald-500/20"
                                    />
                                    <InputError message={errors.email} />
                                </div>

                                <Button
                                    type="submit"
                                    className="h-11 w-full cursor-pointer rounded-lg bg-primary py-3 text-sm font-bold text-primary-foreground shadow-md transition-all duration-300 hover:opacity-90"
                                    disabled={processing}
                                    data-test="email-password-reset-link-button"
                                >
                                    {processing && (
                                        <Spinner className="text-primary-foreground" />
                                    )}
                                    Send Reset Recovery Link
                                </Button>
                            </div>
                        )}
                    </Form>

                    <div className="flex justify-center border-t pt-4">
                        <button
                            type="button"
                            onClick={() => setViewMode('login')}
                            className="inline-flex cursor-pointer items-center gap-1.5 text-xs font-semibold text-muted-foreground transition-colors hover:text-foreground"
                        >
                            <ArrowLeft className="h-3.5 w-3.5" />
                            Return to credentials login
                        </button>
                    </div>
                </div>
            )}

            {status && (
                <div className="mt-4 rounded-xl border border-emerald-500/15 bg-emerald-500/5 px-4 py-2.5 text-center text-sm font-semibold text-emerald-500">
                    {status}
                </div>
            )}
        </div>
    );
}

Login.layout = {
    title: 'Welcome Back Operator',
    description: 'Provide secure credentials to enter the command deck.',
};
