import ThemeToggle from '@/components/theme-toggle';
import AIAssistant from '@/components/ai-assistant';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
    Sheet,
    SheetContent,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from '@/components/ui/sheet';
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
    LogOut,
    Menu,
    Receipt,
    Settings,
    ShoppingCart,
    User,
    Users,
    Wallet,
} from 'lucide-react';
import { PropsWithChildren, useMemo, useState } from 'react';

const navigation = [
    {
        label: 'Dashboard',
        href: 'dashboard',
        icon: Home,
        permission: 'dashboard.view',
    },
    {
        label: 'Materials',
        href: 'products.index',
        icon: Boxes,
        permission: 'products.view',
    },
    {
        label: 'Sales',
        href: 'sales.index',
        icon: ShoppingCart,
        permission: 'sales.view',
    },
    {
        label: 'Invoices',
        href: 'invoices.index',
        icon: Receipt,
        permission: 'invoices.view',
    },
    {
        label: 'Cash Flow',
        href: 'cash-transactions.index',
        icon: Wallet,
        permission: 'cash_transactions.view',
    },
    {
        label: 'Purchases',
        href: 'purchases.index',
        icon: CreditCard,
        permission: 'purchases.view',
    },
    {
        label: 'Customers',
        href: 'customers.index',
        icon: Users,
        permission: 'customers.view',
    },
    {
        label: 'Suppliers',
        href: 'suppliers.index',
        icon: Users,
        permission: 'suppliers.view',
    },
    {
        label: 'Documents',
        href: 'documents.index',
        icon: FileText,
        permission: 'documents.view',
    },
    {
        label: 'Reports',
        href: 'reports.index',
        icon: BarChart3,
        permission: 'reports.view',
    },
    {
        label: 'Users',
        href: 'users.index',
        icon: Users,
        permission: 'users.view',
    },
    {
        label: 'Settings',
        href: 'settings.index',
        icon: Settings,
        permission: 'settings.view',
    },
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
                (item) =>
                    permissions.includes(item.permission) ||
                    permissions.includes('*'),
            ),
        [permissions],
    );

    const userInitials = user?.name
        ?.split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase();

    return (
        <>
            <Head title={title} />
            <div className="flex min-h-screen bg-muted/20">
                {/* Desktop Sidebar */}
                <aside className="hidden w-72 border-r border-border bg-card lg:block">
                    <div className="flex h-full flex-col">
                        <div className="flex h-16 items-center px-6">
                            <Link
                                href={route('dashboard')}
                                className="flex items-center gap-2"
                            >
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                    <Boxes className="h-5 w-5" />
                                </div>
                                <div>
                                    <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground/50">
                                        Salepost
                                    </p>
                                    <h1 className="text-sm font-bold">
                                        {page.props.settings?.business
                                            ?.business_name ?? 'Scrap Registry'}
                                    </h1>
                                </div>
                            </Link>
                        </div>

                        <nav className="flex-1 overflow-y-auto p-4 pt-2">
                            <div className="space-y-1">
                                {links.map((item) => {
                                    const Icon = item.icon;
                                    const active = route().current(item.href);

                                    return (
                                        <Link
                                            key={item.href}
                                            href={route(item.href)}
                                            className={cn(
                                                'group flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                                active
                                                    ? 'bg-primary text-primary-foreground'
                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                            )}
                                        >
                                            <span className="flex items-center gap-3">
                                                <Icon
                                                    className={cn(
                                                        'h-4 w-4',
                                                        active
                                                            ? 'text-primary-foreground'
                                                            : 'text-muted-foreground group-hover:text-foreground',
                                                    )}
                                                />
                                                {item.label}
                                            </span>
                                            {active && (
                                                <ChevronRight className="h-4 w-4 opacity-50" />
                                            )}
                                        </Link>
                                    );
                                })}
                            </div>
                        </nav>

                        <div className="border-t border-border p-4">
                            <div className="flex items-center gap-3 rounded-lg border border-border bg-muted/50 p-3">
                                <Avatar className="h-9 w-9 border border-border">
                                    <AvatarImage src={user?.avatar} />
                                    <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                        {userInitials}
                                    </AvatarFallback>
                                </Avatar>
                                <div className="flex-1 overflow-hidden text-sm">
                                    <p className="truncate font-medium">
                                        {user?.name}
                                    </p>
                                    <p className="truncate text-xs text-muted-foreground">
                                        {user?.roles?.[0] || 'Staff'}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </aside>

                <div className="flex min-h-screen flex-1 flex-col">
                    <header className="sticky top-0 z-30 h-16 border-b border-border bg-background/80 backdrop-blur">
                        <div className="page-shell flex h-full items-center justify-between">
                            <div className="flex items-center gap-4">
                                <Sheet open={open} onOpenChange={setOpen}>
                                    <SheetTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="lg:hidden"
                                        >
                                            <Menu className="h-5 w-5" />
                                        </Button>
                                    </SheetTrigger>
                                    <SheetContent
                                        side="left"
                                        className="w-72 p-0"
                                    >
                                        <div className="flex h-16 items-center border-b border-border px-6">
                                            <div className="flex items-center gap-2">
                                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                                                    <Boxes className="h-5 w-5" />
                                                </div>
                                                <h1 className="text-sm font-bold">
                                                    Salepost
                                                </h1>
                                            </div>
                                        </div>
                                        <nav className="p-4">
                                            <div className="space-y-1">
                                                {links.map((item) => {
                                                    const Icon = item.icon;
                                                    const active = route().current(
                                                        item.href,
                                                    );

                                                    return (
                                                        <Link
                                                            key={item.href}
                                                            href={route(
                                                                item.href,
                                                            )}
                                                            onClick={() =>
                                                                setOpen(false)
                                                            }
                                                            className={cn(
                                                                'flex items-center justify-between rounded-md px-3 py-2 text-sm font-medium transition-colors',
                                                                active
                                                                    ? 'bg-primary text-primary-foreground'
                                                                    : 'text-muted-foreground hover:bg-muted hover:text-foreground',
                                                            )}
                                                        >
                                                            <span className="flex items-center gap-3">
                                                                <Icon className="h-4 w-4" />
                                                                {item.label}
                                                            </span>
                                                        </Link>
                                                    );
                                                })}
                                            </div>
                                        </nav>
                                    </SheetContent>
                                </Sheet>

                                <div className="hidden flex-col lg:flex">
                                    <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-muted-foreground/60">
                                        Internal Operations
                                    </p>
                                    <h2 className="text-sm font-semibold">
                                        {title}
                                    </h2>
                                </div>
                            </div>

                            <div className="flex items-center gap-3">
                                <ThemeToggle />
                                <DropdownMenu>
                                    <DropdownMenuTrigger asChild>
                                        <Button
                                            variant="ghost"
                                            className="relative h-9 w-9 rounded-full"
                                        >
                                            <Avatar className="h-9 w-9 border border-border transition-opacity hover:opacity-80">
                                                <AvatarImage src={user?.avatar} />
                                                <AvatarFallback className="bg-primary/10 text-xs font-semibold text-primary">
                                                    {userInitials}
                                                </AvatarFallback>
                                            </Avatar>
                                        </Button>
                                    </DropdownMenuTrigger>
                                    <DropdownMenuContent
                                        className="w-56"
                                        align="end"
                                        forceMount
                                    >
                                        <DropdownMenuLabel className="font-normal">
                                            <div className="flex flex-col space-y-1">
                                                <p className="text-sm font-medium leading-none">
                                                    {user?.name}
                                                </p>
                                                <p className="text-xs leading-none text-muted-foreground">
                                                    {user?.email}
                                                </p>
                                            </div>
                                        </DropdownMenuLabel>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem asChild>
                                            <Link href={route('profile.edit')}>
                                                <User className="mr-2 h-4 w-4" />
                                                <span>Profile Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuItem asChild>
                                            <Link href={route('settings.index')}>
                                                <Settings className="mr-2 h-4 w-4" />
                                                <span>Business Settings</span>
                                            </Link>
                                        </DropdownMenuItem>
                                        <DropdownMenuSeparator />
                                        <DropdownMenuItem
                                            asChild
                                            className="text-destructive focus:bg-destructive/10 focus:text-destructive"
                                        >
                                            <Link
                                                href={route('logout')}
                                                method="post"
                                                as="button"
                                                className="w-full text-left"
                                            >
                                                <LogOut className="mr-2 h-4 w-4" />
                                                <span>Log out</span>
                                            </Link>
                                        </DropdownMenuItem>
                                    </DropdownMenuContent>
                                </DropdownMenu>
                            </div>
                        </div>
                    </header>

                    <main className="page-shell flex-1 py-8">{children}</main>
                    <AIAssistant />
                </div>
            </div>
        </>
    );
}
