import GuestLayout from '@/Layouts/GuestLayout';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Separator } from '@/components/ui/separator';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
import { getFirebaseAuth } from '@/config/firebase';
import { GoogleAuthProvider, signInWithPopup } from 'firebase/auth';
import axios from 'axios';
import { toast } from 'sonner';

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const [isGoogleLoading, setIsGoogleLoading] = useState(false);
    const { data, setData, post, processing, errors, reset } = useForm({
        email: '',
        password: '',
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route('login'), {
            onFinish: () => reset('password'),
        });
    };

    const handleGoogleLogin = async () => {
        setIsGoogleLoading(true);
        const auth = getFirebaseAuth();
        if (!auth) {
            toast.error('Firebase Auth not initialized');
            setIsGoogleLoading(false);
            return;
        }

        const provider = new GoogleAuthProvider();
        
        try {
            const result = await signInWithPopup(auth, provider);
            const user = result.user;
            
            // Send user data to our backend to create/login session
            const response = await axios.post(route('login.firebase'), {
                uid: user.uid,
                email: user.email,
                name: user.displayName,
                avatar: user.photoURL,
            });

            if (response.data.redirect) {
                window.location.href = response.data.redirect;
            }
        } catch (error: any) {
            console.error('Firebase Auth Error:', error);
            toast.error(error.message || 'Failed to login with Google');
        } finally {
            setIsGoogleLoading(false);
        }
    };

    return (
        <GuestLayout>
            <Head title="Log in" />

            <div className="mb-6 text-center">
                <h1 className="text-2xl font-bold">Welcome back</h1>
                <p className="text-sm text-muted-foreground mt-1">
                    Log in to your scrap registry account
                </p>
            </div>

            {status && (
                <Alert className="mb-4 bg-green-50 border-green-200">
                    <AlertDescription className="text-green-800">
                        {status}
                    </AlertDescription>
                </Alert>
            )}

            <div className="space-y-4">
                <Button 
                    variant="outline" 
                    className="w-full h-11 relative"
                    onClick={handleGoogleLogin}
                    disabled={isGoogleLoading || processing}
                >
                    <svg className="mr-2 h-4 w-4" aria-hidden="true" focusable="false" data-prefix="fab" data-icon="google" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512">
                        <path fill="currentColor" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"></path>
                    </svg>
                    {isGoogleLoading ? 'Connecting...' : 'Continue with Google'}
                </Button>

                <div className="relative flex items-center py-2">
                    <Separator />
                    <span className="absolute left-1/2 -translate-x-1/2 bg-card px-2 text-xs uppercase text-muted-foreground">
                        Or continue with
                    </span>
                </div>

                <form onSubmit={submit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="email">Email</Label>
                        <Input
                            id="email"
                            type="email"
                            name="email"
                            value={data.email}
                            autoComplete="username"
                            placeholder="m@example.com"
                            onChange={(e) => setData('email', e.target.value)}
                        />
                        {errors.email && (
                            <p className="text-sm text-red-600">{errors.email}</p>
                        )}
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="password">Password</Label>
                        <Input
                            id="password"
                            type="password"
                            name="password"
                            value={data.password}
                            autoComplete="current-password"
                            onChange={(e) => setData('password', e.target.value)}
                        />
                        {errors.password && (
                            <p className="text-sm text-red-600">{errors.password}</p>
                        )}
                    </div>

                    <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked) =>
                                    setData('remember', checked === true)
                                }
                            />
                            <Label htmlFor="remember" className="font-normal text-sm">
                                Remember me
                            </Label>
                        </div>
                        
                        {canResetPassword && (
                            <Link
                                href={route('password.request')}
                                className="text-sm font-medium text-primary hover:underline transition-colors"
                            >
                                Forgot password?
                            </Link>
                        )}
                    </div>

                    <Button type="submit" disabled={processing || isGoogleLoading} className="w-full h-11">
                        {processing ? 'Logging in...' : 'Log in'}
                    </Button>
                </form>
            </div>
        </GuestLayout>
    );
}
