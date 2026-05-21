import ApplicationLogo from '@/components/application-logo';
import { Link } from '@inertiajs/react';
import { PropsWithChildren } from 'react';
import { Card, CardContent } from '@/components/ui/card';

export default function Guest({ children }: PropsWithChildren) {
    return (
        <div className="flex min-h-screen flex-col items-center bg-background text-foreground pt-6 sm:justify-center sm:pt-0">
            <div>
                <Link href="/">
                    <ApplicationLogo className="h-20 w-20 fill-current text-primary" />
                </Link>
            </div>

            <Card className="mt-6 w-full sm:max-w-md">
                <CardContent className="px-6 py-4">
                    {children}
                </CardContent>
            </Card>
        </div>
    );
}
