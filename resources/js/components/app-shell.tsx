import ThemeToggle from '@/components/theme-toggle';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { PageProps } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';
import {
    BarChart3,
    Boxes,
    ChevronRight,
    CreditCard,
    FileText,
    Home,
    Menu,
    Receipt,
    Settings,
    ShoppingCart,
    Users,
    Wallet,
    X,
} from 'lucide-react';
import { PropsWithChildren, useMemo, useState } from 'react';

const navigation = [
    { label: 'Dashboard', href: 'dashboard', icon: Home, permission: 'dashboard.view' },
    { label: 'Materials', href: 'products.index', icon: Boxes, permission: 'products.view' },
    { label: 'Sales', href: 'sales.index', icon: ShoppingCart, permission: 'sales.view' },
    { label: 'Invoices', href: 'invoices.index', icon: Receipt, permission: 'invoices.view' },
    { label: 'Cash Flow', href: 'cash-transactions.index', icon: Wallet, permission: 'cash_transactions.view' },
    { label: 'Purchases', href: 'purchases.index', icon: CreditCard, permission: 'purchases.view' },
    { label: 'Customers', href: 'customers.index', icon: Users, permission: 'customers.view' },
    { label: 'Suppliers', href: 'suppliers.index', icon: Users, permission: 'suppliers.view' },
    { label: 'Documents', href: 'documents.index', icon: FileText, permission: 'documents.view' },
    { label: 'Reports', href: 'reports.index', icon: BarChart3, permission: 'reports.view' },
    { label: 'Users', href: 'users.index', icon: Users, permission: 'users.view' },
    { label: 'Settings', href: 'settings.index', icon: Settings, permission: 'settings.view' },
];

export default function AppShell({
    children,
    title,
}: PropsWithChildren<{ title: string }>) {
    const [open, setOpen] = useState(false);
    const page = usePage<PageProps>();
    const user = page.props.auth.user;
    const permissions = user?.permissions ?? [];

    const links = useMemo(
        () =>
            navigation.filter(
                (item) => permissions.includes(item.permission) || permissions.includes('*'),
            ),
        [permissions],
    );

    return (
        <>
            <Head title={title} />
            <div className="min-h-screen">
                <div className="flex min-h-screen">
                    <aside
                        className={cn(
                            'fixed inset-y-0 left-0 z-40 w-72 border-r border-base bg-panel p-5 transition-transform lg:static lg:translate-x-0',
                            open ? 'translate-x-0' : '-translate-x-full',
                        )}
                    >
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs uppercase tracking-[0.25em] text-muted-copy">
                                    Salepost
                                </p>
                                <h1 className="text-xl font-bold">
                                    {page.props.settings?.business?.business_name ?? 'Scrap Registry'}
                                </h1>
                            </div>
                            <Button
                                variant="ghost"
                                size="icon"
                                className="lg:hidden"
                                onClick={() => setOpen(false)}
                            >
                                <X className="h-4 w-4" />
                            </Button>
                        </div>

                        <nav className="mt-8 space-y-1">
                            {links.map((item) => {
                                const Icon = item.icon;
                                const active = route().current(item.href);

                                return (
                                    <Link
                                        key={item.href}
                                        href={route(item.href)}
                                        className={cn(
                                            'flex items-center justify-between rounded-2xl px-3 py-3 text-sm transition',
                                            active
                                                ? 'bg-[hsl(var(--primary))] text-[hsl(var(--primary-foreground))]'
                                                : 'hover:bg-muted-panel',
                                        )}
                                    >
                                        <span className="flex items-center gap-3">
                                            <Icon className="h-4 w-4" />
                                            {item.label}
                                        </span>
                                        <ChevronRight className="h-4 w-4 opacity-60" />
                                    </Link>
                                );
                            })}
                        </nav>
                    </aside>

                    <div className="flex min-h-screen flex-1 flex-col lg:pl-0">
                        <header className="sticky top-0 z-30 border-b border-base bg-[hsl(var(--background))]/80 backdrop-blur">
                            <div className="page-shell flex items-center justify-between py-4">
                                <div className="flex items-center gap-3">
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        className="lg:hidden"
                                        onClick={() => setOpen(true)}
                                    >
                                        <Menu className="h-4 w-4" />
                                    </Button>
                                    <div>
                                        <p className="text-xs uppercase tracking-[0.24em] text-muted-copy">
                                            Internal Operations
                                        </p>
                                        <h2 className="text-lg font-semibold">{title}</h2>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3">
                                    <ThemeToggle />
                                    <div className="hidden rounded-2xl border border-base bg-panel px-4 py-2 text-right sm:block">
                                        <p className="text-sm font-medium">{user?.name}</p>
                                        <p className="text-xs text-muted-copy">
                                            {user?.roles?.join(', ') || 'Staff'}
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </header>

                        <main className="page-shell flex-1">{children}</main>
                    </div>
                </div>
            </div>
        </>
    );
}
