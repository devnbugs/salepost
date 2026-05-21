import { Head } from '@inertiajs/react';
import {
    TrendingUp,
    Coins,
    Scale,
    Activity,
    Building2,
    Layers,
    Sparkles,
    AlertTriangle,
    ArrowUpRight,
    ArrowDownRight,
    CheckCircle2,
    Clock,
    User,
    ChevronRight,
    MapPin,
    Package,
} from 'lucide-react';
import { AIAssistant } from '@/components/ai-assistant';
import { dashboard } from '@/routes';

interface SpotPrice {
    name: string;
    price: number;
    unit: string;
}

interface Branch {
    id: number;
    name: string;
    code: string;
    address: string;
}

interface CardMetrics {
    today_sales_total: number;
    weekly_sales_total: number;
    monthly_sales_total: number;
    cash_in_today: number;
    cash_out_today: number;
    outstanding_customer_balances: number;
    low_stock_alerts: number;
    total_stock_volume: number;
    today_cash_flow: number;
    active_products_count: number;
}

interface RecentInvoice {
    id: number;
    invoice_number: string;
    invoice_date: string;
    total_amount: string | number;
    status: string;
    customer?: { name: string };
}

interface RecentCashTransaction {
    id: number;
    amount: string | number;
    direction: 'inflow' | 'outflow';
    transaction_date: string;
    notes?: string;
    customer?: { name: string };
    supplier?: { name: string };
}

interface LowStockProduct {
    id: number;
    name: string;
    sku: string;
    current_stock: string | number;
    reorder_level: string | number;
    unit_of_measure: string;
}

interface DashboardProps {
    cards: CardMetrics;
    recent_invoices?: RecentInvoice[];
    recent_cash_transactions?: RecentCashTransaction[];
    low_stock_products?: LowStockProduct[];
    spot_prices?: SpotPrice[];
    branch: Branch;
    top_selling_material?: { name: string; total: number } | null;
}

export default function Dashboard({
    cards,
    recent_invoices = [],
    recent_cash_transactions = [],
    low_stock_products = [],
    spot_prices = [],
    branch,
    top_selling_material = null,
}: DashboardProps) {
    // Formatting helper
    const formatCurrency = (amount: number | string) => {
        const value = typeof amount === 'string' ? parseFloat(amount) : amount;

        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(value);
    };

    const formatStock = (amount: number | string, unit: string = 'kg') => {
        const value = typeof amount === 'string' ? parseFloat(amount) : amount;

        return `${new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(value)} ${unit}`;
    };

    // Calculate interactive strategy tip
    const getDynamicStrategyTip = () => {
        if (top_selling_material && top_selling_material.total > 0) {
            return (
                <>
                    <strong>Daily Strategy Tip:</strong> Your branch's top selling material is{' '}
                    <span className="text-emerald-500 font-bold">{top_selling_material.name}</span> (
                    {formatStock(top_selling_material.total)} moved). Keep inventory of this material optimal.
                </>
            );
        }

        return (
            <>
                <strong>Daily Strategy Tip:</strong> Copper prices are predicted to rise due to regional supplies bottlenecks. Hold wiring inventory.
            </>
        );
    };

    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-full flex-1 flex-col gap-6 p-4 text-left">
                {/* Header Welcome banner */}
                <div className="flex flex-col gap-2 border-b pb-4 sm:flex-row sm:items-center sm:justify-between">
                    <div>
                        <h2 className="text-2xl font-bold tracking-tight">
                            Operator Dashboard
                        </h2>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                            Manage active yard inventories, records, and run predictive ML models.
                        </p>
                    </div>
                    <div className="inline-flex items-center gap-2 rounded-lg border bg-muted/30 px-3 py-1.5 text-xs text-muted-foreground sm:self-start">
                        <MapPin className="h-4 w-4 text-emerald-500" />
                        <span>Active Context: {branch.name}</span>
                    </div>
                </div>

                {/* Analytical Card Counters Grid */}
                <div className="grid gap-4 md:grid-cols-4">
                    {/* Active Inventory */}
                    <div className="flex items-center justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Total Stock
                            </span>
                            <div className="font-mono text-2xl font-extrabold">
                                {formatStock(cards.total_stock_volume || 0)}
                            </div>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                            <Layers className="h-5.5 w-5.5" />
                        </div>
                    </div>

                    {/* Today's Transactions */}
                    <div className="flex items-center justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Today's Net Cash Flow
                            </span>
                            <div className={`font-mono text-2xl font-extrabold ${cards.today_cash_flow >= 0 ? 'text-emerald-500' : 'text-rose-500'}`}>
                                {cards.today_cash_flow >= 0 ? '+' : ''}
                                {formatCurrency(cards.today_cash_flow || 0)}
                            </div>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                            <Coins className="h-5.5 w-5.5" />
                        </div>
                    </div>

                    {/* Active Products Count */}
                    <div className="flex items-center justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Active Products
                            </span>
                            <div className="font-mono text-2xl font-extrabold">
                                {cards.active_products_count || 0} Listed
                            </div>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                            <Package className="h-5.5 w-5.5" />
                        </div>
                    </div>

                    {/* Low Stock Alerts Count */}
                    <div className="flex items-center justify-between rounded-xl border bg-card p-5 text-card-foreground shadow-xs">
                        <div className="space-y-1">
                            <span className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                Low Stock Alerts
                            </span>
                            <div className={`flex items-center gap-1.5 font-mono text-2xl font-extrabold ${cards.low_stock_alerts > 0 ? 'text-amber-500' : 'text-emerald-500'}`}>
                                {cards.low_stock_alerts > 0 ? (
                                    <>
                                        <AlertTriangle className="h-5 w-5 animate-pulse text-amber-500" />
                                        <span>{cards.low_stock_alerts} Alerts</span>
                                    </>
                                ) : (
                                    <>
                                        <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                                        <span>Healthy</span>
                                    </>
                                )}
                            </div>
                        </div>
                        <div className="rounded-lg bg-emerald-500/10 p-3 text-emerald-500">
                            <Scale className="h-5.5 w-5.5" />
                        </div>
                    </div>
                </div>

                {/* Interactive pricing & operation widgets layout */}
                <div className="grid gap-6 md:grid-cols-12">
                    {/* Welcome Box */}
                    <div className="relative flex h-[300px] flex-col justify-between overflow-hidden rounded-xl border bg-muted/40 p-6 text-left md:col-span-8">
                        <div className="pointer-events-none absolute top-0 right-0 h-48 w-48 rounded-full bg-emerald-500/10 blur-3xl" />

                        <div className="space-y-2">
                            <div className="inline-flex animate-pulse items-center gap-1.5 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-bold tracking-wider text-emerald-500 uppercase">
                                <Sparkles className="h-3.5 w-3.5" />
                                Interactive AI Ready
                            </div>
                            <h3 className="text-xl font-bold">
                                Launch your intelligent scrap command center.
                            </h3>
                            <p className="max-w-xl text-sm leading-relaxed text-muted-foreground">
                                Real-time inventory tracking, spot pricing analysis, and customer invoice generation has never been easier. Use the floating Firebase AI Advisor button on the bottom right corner to run complex price trends, forecast indices, and optimize yard supply strategies instantly.
                            </p>
                        </div>

                        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:gap-4 text-xs font-semibold text-muted-foreground">
                            <div className="flex items-center gap-1.5">
                                <Building2 className="h-4 w-4 text-emerald-500" />
                                Connected to {branch.name} ({branch.code}) server.
                            </div>
                            <span className="hidden text-muted-foreground/30 sm:inline">|</span>
                            <div className="flex items-center gap-1">
                                <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
                                Database Status: Operational
                            </div>
                        </div>
                    </div>

                    {/* Mini Quick rates Widget */}
                    <div className="flex h-[300px] flex-col justify-between rounded-xl border bg-card p-5 text-left text-card-foreground shadow-xs md:col-span-4">
                        <div className="space-y-3">
                            <div className="flex items-center justify-between border-b pb-2">
                                <div className="flex items-center gap-1.5">
                                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                                    <h4 className="text-sm font-bold">
                                        Active Exchange Indices
                                    </h4>
                                </div>
                                <span className="animate-pulse font-mono text-[10px] font-semibold text-emerald-500">
                                    Sync: Live
                                </span>
                            </div>

                            <div className="max-h-[145px] overflow-y-auto space-y-2.5 font-mono text-xs pr-1">
                                {spot_prices.map((item, idx) => (
                                    <div key={idx} className="flex items-center justify-between border-b border-muted/30 pb-1 last:border-0 last:pb-0">
                                        <span className="text-muted-foreground truncate max-w-[150px]">
                                            {item.name}
                                        </span>
                                        <span className="font-bold text-emerald-500">
                                            {formatCurrency(item.price)}/{item.unit}
                                        </span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        <div className="rounded-lg border bg-muted/50 p-3 text-[11px] leading-relaxed text-muted-foreground mt-2">
                            {getDynamicStrategyTip()}
                        </div>
                    </div>
                </div>

                {/* Real-time Yard Analytics and Warning Centers */}
                <div className="grid gap-6 md:grid-cols-12">
                    {/* Low Stock Warning Alert Center */}
                    <div className="rounded-xl border bg-card p-5 text-left shadow-xs md:col-span-5 flex flex-col justify-between min-h-[350px]">
                        <div>
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <AlertTriangle className="h-4 w-4 text-amber-500" />
                                    <h3 className="text-sm font-bold">Low Stock Warning Center</h3>
                                </div>
                                <span className="rounded-full bg-amber-500/10 px-2 py-0.5 font-mono text-[10px] font-semibold text-amber-500">
                                    {low_stock_products.length} Items Affected
                                </span>
                            </div>

                            {low_stock_products.length > 0 ? (
                                <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1">
                                    {low_stock_products.map((prod) => (
                                        <div key={prod.id} className="flex items-center justify-between rounded-lg border bg-muted/30 p-2 text-xs">
                                            <div className="space-y-0.5">
                                                <div className="font-bold tracking-tight">{prod.name}</div>
                                                <div className="font-mono text-[10px] text-muted-foreground">{prod.sku}</div>
                                            </div>
                                            <div className="text-right space-y-0.5 font-mono">
                                                <div className="font-extrabold text-rose-500">
                                                    Stock: {formatStock(prod.current_stock, prod.unit_of_measure)}
                                                </div>
                                                <div className="text-[9px] text-muted-foreground">
                                                    Limit: {formatStock(prod.reorder_level, prod.unit_of_measure)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <CheckCircle2 className="h-10 w-10 text-emerald-500/30 mb-2" />
                                    <div className="text-xs font-bold text-muted-foreground">All Stocks Healthy</div>
                                    <div className="text-[10px] text-muted-foreground/70 mt-1">No products are currently under reorder thresholds.</div>
                                </div>
                            )}
                        </div>

                        {low_stock_products.length > 0 && (
                            <div className="border-t pt-3 mt-4 text-[10px] text-muted-foreground flex items-center gap-1.5">
                                <Clock className="h-3.5 w-3.5 text-amber-500 animate-pulse" />
                                Trigger purchase procurement to replenish branch capacity.
                            </div>
                        )}
                    </div>

                    {/* Operational Cash Transaction activity ledger */}
                    <div className="rounded-xl border bg-card p-5 text-left shadow-xs md:col-span-7 flex flex-col justify-between min-h-[350px]">
                        <div>
                            <div className="flex items-center justify-between border-b pb-3 mb-4">
                                <div className="flex items-center gap-2">
                                    <Activity className="h-4 w-4 text-emerald-500" />
                                    <h3 className="text-sm font-bold">Operational Activity Ledger</h3>
                                </div>
                                <span className="font-mono text-[10px] font-semibold text-muted-foreground">
                                    Recent Cash Logs
                                </span>
                            </div>

                            {recent_cash_transactions.length > 0 ? (
                                <div className="space-y-3.5 max-h-[220px] overflow-y-auto pr-1">
                                    {recent_cash_transactions.map((tx) => (
                                        <div key={tx.id} className="flex items-center justify-between border-b border-muted/20 pb-2.5 last:border-0 last:pb-0">
                                            <div className="flex items-center gap-2.5">
                                                <div className={`rounded-full p-2 ${tx.direction === 'inflow' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-rose-500/10 text-rose-500'}`}>
                                                    {tx.direction === 'inflow' ? (
                                                        <ArrowUpRight className="h-4 w-4" />
                                                    ) : (
                                                        <ArrowDownRight className="h-4 w-4" />
                                                    )}
                                                </div>
                                                <div className="space-y-0.5">
                                                    <div className="text-xs font-bold">
                                                        {tx.customer?.name || tx.supplier?.name || 'Walk-in Partner'}
                                                    </div>
                                                    <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                                                        <span>{new Date(tx.transaction_date).toLocaleDateString()}</span>
                                                        {tx.notes && (
                                                            <>
                                                                <span>•</span>
                                                                <span className="truncate max-w-[200px]">{tx.notes}</span>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            <div className={`font-mono text-xs font-extrabold ${tx.direction === 'inflow' ? 'text-emerald-500' : 'text-rose-500'}`}>
                                                {tx.direction === 'inflow' ? '+' : '-'}
                                                {formatCurrency(tx.amount)}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="flex flex-col items-center justify-center py-12 text-center">
                                    <Coins className="h-10 w-10 text-muted-foreground/20 mb-2" />
                                    <div className="text-xs font-bold text-muted-foreground">No Transactions Recorded</div>
                                    <div className="text-[10px] text-muted-foreground/70 mt-1">Cash logs will populate as operators record incoming/outgoing values.</div>
                                </div>
                            )}
                        </div>

                        {recent_cash_transactions.length > 0 && (
                            <div className="border-t pt-3 mt-4 text-[10px] text-muted-foreground flex items-center justify-between">
                                <span className="flex items-center gap-1">
                                    <User className="h-3.5 w-3.5 text-emerald-500" />
                                    System aggregates real-time yard liquidity flow.
                                </span>
                                <span className="text-[10px] font-semibold text-emerald-500 flex items-center gap-0.5 hover:underline cursor-pointer">
                                    View full logs <ChevronRight className="h-3 w-3" />
                                </span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Recent Invoices Panel (Optional summary banner if invoices exist) */}
                {recent_invoices.length > 0 && (
                    <div className="rounded-xl border bg-muted/20 p-4 mt-2">
                        <div className="flex items-center justify-between mb-3 border-b border-muted pb-2">
                            <h4 className="text-xs font-bold flex items-center gap-1.5 text-muted-foreground">
                                <Clock className="h-3.5 w-3.5" /> Recent Invoicing Cycles
                            </h4>
                            <span className="text-[10px] font-semibold text-emerald-500 hover:underline cursor-pointer flex items-center">
                                Invoice Hub <ChevronRight className="h-3 w-3" />
                            </span>
                        </div>
                        <div className="grid gap-3 sm:grid-cols-3">
                            {recent_invoices.slice(0, 3).map((inv) => (
                                <div key={inv.id} className="rounded-lg border bg-card p-3 text-xs flex justify-between items-center shadow-xs">
                                    <div>
                                        <div className="font-mono text-[10px] text-muted-foreground">{inv.invoice_number}</div>
                                        <div className="font-bold mt-0.5">{inv.customer?.name || 'Cash Customer'}</div>
                                    </div>
                                    <div className="text-right">
                                        <div className="font-mono font-extrabold text-emerald-500">{formatCurrency(inv.total_amount)}</div>
                                        <span className="inline-block mt-1 px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-500 text-[8px] font-bold uppercase tracking-wider">
                                            {inv.status}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </div>

            {/* Embed the beautiful AI assistant floating widget */}
            <AIAssistant />
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
