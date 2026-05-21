import { Button } from '@/components/ui/button';
import { PageProps } from '@/types';
import { Head, Link } from '@inertiajs/react';
import {
    ArrowRight,
    BarChart3,
    Boxes,
    LayoutDashboard,
    Recycle,
    ShieldCheck,
    Truck,
    Wallet,
} from 'lucide-react';

export default function Welcome({
    auth,
    settings,
}: PageProps) {
    const businessName = settings?.business?.business_name || 'Salepost';

    return (
        <>
            <Head title={`Welcome to ${businessName}`} />

            <div className="flex min-h-screen flex-col bg-background font-sans text-foreground">
                {/* Header */}
                <header className="flex items-center justify-between border-b px-6 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex size-10 items-center justify-center rounded-xl bg-primary text-xl font-bold text-primary-foreground shadow-lg shadow-primary/20">
                            <Recycle className="h-6 w-6" />
                        </div>
                        <span className="text-xl font-bold tracking-tight">
                            {businessName}
                        </span>
                    </div>
                    <nav className="flex items-center gap-4">
                        {auth.user ? (
                            <Link href={route('dashboard')}>
                                <Button variant="default" className="rounded-full">
                                    <LayoutDashboard className="mr-2 h-4 w-4" />
                                    Dashboard
                                </Button>
                            </Link>
                        ) : (
                            <Link href={route('login')}>
                                <Button variant="default" className="rounded-full px-8">
                                    Log in
                                </Button>
                            </Link>
                        )}
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="flex flex-1 flex-col">
                    <section className="relative overflow-hidden px-6 py-24 text-center md:py-32">
                        {/* Background Decoration */}
                        <div className="absolute left-1/2 top-0 -z-10 h-[500px] w-[800px] -translate-x-1/2 opacity-20 blur-[120px] [background:radial-gradient(circle_at_center,var(--primary)_0%,transparent_70%)]" />

                        <div className="mx-auto max-w-4xl space-y-8">
                            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/5 px-4 py-1.5 text-xs font-semibold text-primary">
                                Nigerian Scrap Industry's Choice
                            </div>

                            <h1 className="bg-gradient-to-br from-foreground to-foreground/70 bg-clip-text text-5xl font-extrabold tracking-tight text-transparent md:text-7xl">
                                Smart Scrap Inventory & Operations Management
                            </h1>

                            <p className="mx-auto max-w-2xl text-xl text-muted-foreground">
                                The all-in-one registry for Nigerian scrap businesses. Track every kilo, manage every payment, and analyze your sales with modern AI tools.
                            </p>

                            <div className="flex items-center justify-center gap-4 pt-4">
                                {auth.user ? (
                                    <Link href={route('dashboard')}>
                                        <Button
                                            size="lg"
                                            className="h-14 rounded-full px-8 text-base shadow-xl shadow-primary/20"
                                        >
                                            Go to Dashboard
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={route('login')}>
                                        <Button
                                            size="lg"
                                            className="h-14 rounded-full px-8 text-base shadow-xl shadow-primary/20"
                                        >
                                            Access Your Registry
                                            <ArrowRight className="ml-2 h-5 w-5" />
                                        </Button>
                                    </Link>
                                )}
                            </div>
                        </div>
                    </section>

                    {/* Features Section */}
                    <section className="bg-muted/30 px-6 py-24">
                        <div className="mx-auto w-full max-w-6xl">
                            <div className="mb-16 text-center">
                                <h2 className="text-3xl font-bold">Built for Nigeria's Scrap Business</h2>
                                <p className="mt-4 text-muted-foreground">Everything you need to run a professional yard or trading operation.</p>
                            </div>
                            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                                <FeatureCard
                                    icon={<Boxes className="h-8 w-8" />}
                                    title="Material Tracking"
                                    description="Categorize and track stock of Brass, Aluminum, Copper, Iron and more in real-time."
                                />
                                <FeatureCard
                                    icon={<Truck className="h-8 w-8" />}
                                    title="Supply Chain"
                                    description="Manage purchases from collectors and suppliers with detailed weight and rate logs."
                                />
                                <FeatureCard
                                    icon={<BarChart3 className="h-8 w-8" />}
                                    title="Analytics Dashboard"
                                    description="Gain insights into market trends and your most profitable materials instantly."
                                />
                                <FeatureCard
                                    icon={<Wallet className="h-8 w-8" />}
                                    title="Cash Flow Control"
                                    description="Monitor inflows and outflows with multi-currency support and detailed audits."
                                />
                                <FeatureCard
                                    icon={<ShieldCheck className="h-8 w-8" />}
                                    title="Anti-Fraud & Audit"
                                    description="Comprehensive activity logs and permission levels to secure your business assets."
                                />
                                <FeatureCard
                                    icon={<Recycle className="h-8 w-8" />}
                                    title="Sustainable Growth"
                                    description="Optimize your operations for efficiency and better margins in the recycling economy."
                                />
                            </div>
                        </div>
                    </section>
                </main>

                {/* Footer */}
                <footer className="border-t py-12 text-center">
                    <div className="mx-auto max-w-6xl px-6">
                        <div className="flex flex-col items-center gap-4 md:flex-row md:justify-between">
                            <div className="flex items-center gap-2">
                                <Recycle className="h-5 w-5 text-primary" />
                                <span className="font-bold">{businessName} Registry</span>
                            </div>
                            <p className="text-sm text-muted-foreground">
                                &copy; {new Date().getFullYear()} {businessName}. All
                                rights reserved.
                            </p>
                        </div>
                    </div>
                </footer>
            </div>
        </>
    );
}

function FeatureCard({
    icon,
    title,
    description,
}: {
    icon: React.ReactNode;
    title: string;
    description: string;
}) {
    return (
        <div className="group flex flex-col items-start rounded-3xl border bg-card p-8 text-card-foreground transition-all hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/5">
            <div className="mb-6 rounded-2xl bg-primary/10 p-4 text-primary transition-colors group-hover:bg-primary group-hover:text-primary-foreground">
                {icon}
            </div>
            <h3 className="mb-3 text-xl font-bold tracking-tight">
                {title}
            </h3>
            <p className="text-left text-muted-foreground leading-relaxed">{description}</p>
        </div>
    );
}
