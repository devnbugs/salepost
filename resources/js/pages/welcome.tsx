import { Head, Link, usePage } from '@inertiajs/react';
import {
    Activity,
    TrendingUp,
    Sparkles,
    Recycle,
    DollarSign,
    Users,
    Leaf,
    Layers,
    ShieldCheck,
    FileText,
    ArrowRight,
    Zap,
    Scale,
    Flame,
} from 'lucide-react';
import { useState } from 'react';
import { AIAssistant } from '@/components/ai-assistant';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { dashboard, login } from '@/routes';


interface Material {
    name: string;
    stock: number;
    price: number;
    unit: string;
}

interface Stats {
    total_volume_kg: number;
    total_value_naira: number;
    total_partners: number;
    co2_saved_tons: number;
    trees_saved?: number;
}

interface WelcomeProps {
    stats: Stats;
    materials: Material[];
}

export default function Welcome() {
    const { stats, materials } = usePage<any>()
        .props as unknown as WelcomeProps;
    const { auth } = usePage<any>().props;

    // Interactive Calculator state
    const [calcWeight, setCalcWeight] = useState<number>(500); // default 500kg

    // Environmental savings math
    const calculateCo2 = (weight: number) => (weight * 1.8).toFixed(1);
    const calculateEnergy = (weight: number) => (weight * 0.0012).toFixed(2); // in MWh
    const calculateCoal = (weight: number) => (weight * 0.85).toFixed(0); // in kg of coal saved

    // Format currency (Naira)
    const formatNaira = (amount: number) => {
        return new Intl.NumberFormat('en-NG', {
            style: 'currency',
            currency: 'NGN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount);
    };

    return (
        <>
            <Head title="Salepost Scrap ERP - Premium High-Velocity Business Management" />

            <div className="relative min-h-screen bg-background font-sans text-foreground selection:bg-primary selection:text-primary-foreground">
                {/* HEADER / NAVIGATION */}
                <header className="sticky top-0 z-50 border-b border-border bg-background/80 backdrop-blur-md">
                    <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center gap-3">
                            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary text-primary-foreground shadow-sm">
                                <Recycle className="h-5 w-5" />
                            </div>
                            <div className="flex items-center gap-2">
                                <span className="text-lg font-bold tracking-tight text-foreground">
                                    Salepost
                                </span>
                                <Badge
                                    variant="outline"
                                    className="hidden px-1.5 py-0 text-[10px] sm:inline-flex"
                                >
                                    Scrap ERP
                                </Badge>
                            </div>
                        </div>

                        <nav className="flex items-center gap-4">
                            {auth?.user ? (
                                <Link href={dashboard()}>
                                    <Button size="sm" className="gap-1.5">
                                        Dashboard
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Button>
                                </Link>
                            ) : (
                                <Link href={login()}>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="gap-1.5"
                                    >
                                        Sign In
                                        <ArrowRight className="h-3.5 w-3.5" />
                                    </Button>
                                </Link>
                            )}
                        </nav>
                    </div>
                </header>

                {/* HERO SECTION */}
                <section className="relative mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-20">
                    <div className="grid items-center gap-12 lg:grid-cols-12">
                        {/* Left Column: Hero Text */}
                        <div className="flex flex-col items-start gap-6 lg:col-span-7">
                            {/* Live Heartbeat Badge */}
                            <div className="inline-flex items-center gap-2 rounded-full border border-border bg-muted/60 px-3 py-1.5 text-xs text-muted-foreground">
                                <span className="relative flex h-2 w-2">
                                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-75"></span>
                                    <span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500"></span>
                                </span>
                                <span className="font-semibold">
                                    Platform Operational
                                </span>
                            </div>

                            <h1 className="text-4xl leading-[1.1] font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-6xl">
                                High-Velocity <br />
                                <span className="text-muted-foreground">
                                    Scrap Management
                                </span>{' '}
                                <br />
                                Made Production-Ready.
                            </h1>

                            <p className="max-w-xl text-base leading-relaxed text-muted-foreground sm:text-lg">
                                A premium internal business management suite
                                tailored specifically for the Nigerian scrap and
                                metal recycling sector. Seamlessly track
                                acquisitions, monitor live stockpiles, generate
                                invoices, and handle accounts from a unified
                                command deck.
                            </p>

                            <div className="flex w-full flex-col gap-4 pt-2 sm:w-auto sm:flex-row">
                                {auth?.user ? (
                                    <Link
                                        href={dashboard()}
                                        className="w-full sm:w-auto"
                                    >
                                        <Button
                                            size="lg"
                                            className="w-full text-base font-semibold sm:w-auto"
                                        >
                                            Access Internal Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link
                                        href={login()}
                                        className="w-full sm:w-auto"
                                    >
                                        <Button
                                            size="lg"
                                            className="w-full text-base font-semibold sm:w-auto"
                                        >
                                            Log In & Launch System
                                        </Button>
                                    </Link>
                                )}
                                <a
                                    href="#market-rates"
                                    className="w-full sm:w-auto"
                                >
                                    <Button
                                        size="lg"
                                        variant="outline"
                                        className="w-full text-base font-semibold sm:w-auto"
                                    >
                                        View Live Exchange Pricing
                                    </Button>
                                </a>
                            </div>

                            {/* Trust Signals */}
                            <div className="mt-2 grid w-full max-w-md grid-cols-3 gap-4 border-t border-border pt-6">
                                <div>
                                    <div className="text-xl font-bold text-foreground">
                                        99.9%
                                    </div>
                                    <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        Uptime SLA
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-foreground">
                                        Multi-Branch
                                    </div>
                                    <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        Ready Schema
                                    </div>
                                </div>
                                <div>
                                    <div className="text-xl font-bold text-foreground">
                                        AES-256
                                    </div>
                                    <div className="text-[10px] font-semibold tracking-wider text-muted-foreground uppercase">
                                        Secure Ledger
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Right Column: Hero Stats Card */}
                        <div className="w-full lg:col-span-5">
                            <Card className="w-full border-border bg-card shadow-sm">
                                <CardHeader className="flex flex-row items-center justify-between border-b border-border/50 pb-4">
                                    <div className="flex items-center gap-2">
                                        <Activity className="h-5 w-5 text-muted-foreground" />
                                        <CardTitle className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                                            System Analytics
                                        </CardTitle>
                                    </div>
                                    <Badge variant="outline">Live Stats</Badge>
                                </CardHeader>
                                <CardContent className="space-y-6 pt-6">
                                    <div>
                                        <span className="mb-1 block text-xs text-muted-foreground">
                                            Total Scrap Metal Processed
                                        </span>
                                        <div className="flex items-baseline gap-2">
                                            <span className="text-4xl font-extrabold tracking-tight text-foreground">
                                                {stats
                                                    ? (
                                                          stats.total_volume_kg /
                                                          1000
                                                      ).toFixed(2)
                                                    : '1.42'}
                                            </span>
                                            <span className="text-sm font-semibold text-muted-foreground">
                                                Metric Tons
                                            </span>
                                        </div>
                                    </div>

                                    <div>
                                        <span className="mb-1 block text-xs text-muted-foreground">
                                            Total Value Exchanged
                                        </span>
                                        <div className="text-3xl font-extrabold text-foreground">
                                            {stats
                                                ? formatNaira(
                                                      stats.total_value_naira,
                                                  )
                                                : '₦2,529,750'}
                                        </div>
                                    </div>

                                    <div className="mt-2 grid grid-cols-2 gap-4 border-t border-border pt-4">
                                        <div>
                                            <span className="mb-1 block text-xs text-muted-foreground">
                                                Active Partners
                                            </span>
                                            <div className="flex items-center gap-1.5 text-lg font-bold text-foreground">
                                                <Users className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {stats
                                                        ? stats.total_partners
                                                        : '8'}
                                                </span>
                                            </div>
                                        </div>
                                        <div>
                                            <span className="mb-1 block text-xs text-muted-foreground">
                                                CO₂ Offset Savings
                                            </span>
                                            <div className="flex items-center gap-1.5 text-lg font-bold text-foreground">
                                                <Leaf className="h-4 w-4 text-muted-foreground" />
                                                <span>
                                                    {stats
                                                        ? stats.co2_saved_tons
                                                        : '2.56'}{' '}
                                                    t
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* LIVE EXCHANGE pricing TABLE */}
                <section
                    id="market-rates"
                    className="border-y border-border bg-muted/30 py-16 sm:py-24"
                >
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-3 text-center">
                            <Badge variant="secondary" className="gap-1.5 py-1">
                                <TrendingUp className="h-3.5 w-3.5" />
                                Market Exchange Rates
                            </Badge>
                            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                Live Material Pricing & Stock Level Board
                            </h2>
                            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Directly connected to the internal warehouse
                                ledgers. Displays active stock availability and
                                spot prices per unit for Nigerian scrap yard
                                products.
                            </p>
                        </div>

                        {/* pricing board card */}
                        <Card className="overflow-hidden border border-border bg-card shadow-sm">
                            <CardHeader className="flex flex-row items-center justify-between gap-4 border-b border-border/50 bg-muted/30 pb-4">
                                <div className="flex items-center gap-2">
                                    <Sparkles className="h-4 w-4 animate-pulse text-primary" />
                                    <span className="text-sm font-bold tracking-wide text-foreground uppercase">
                                        Live Spot Market Rates
                                    </span>
                                </div>
                                <span className="font-mono text-xs text-muted-foreground">
                                    Last synchronized: Just now
                                </span>
                            </CardHeader>

                            <CardContent className="p-0">
                                <div className="w-full overflow-x-auto">
                                    <table className="w-full border-collapse text-left text-sm">
                                        <thead>
                                            <tr className="border-b border-border bg-muted/50 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                                <th className="px-6 py-4">
                                                    Material Name
                                                </th>
                                                <th className="px-6 py-4 text-right">
                                                    Available Stock
                                                </th>
                                                <th className="px-6 py-4 text-right">
                                                    Selling Price
                                                </th>
                                                <th className="px-6 py-4 text-right">
                                                    UOM
                                                </th>
                                                <th className="px-6 py-4 text-center">
                                                    Status
                                                </th>
                                            </tr>
                                        </thead>
                                        <tbody className="divide-y divide-border">
                                            {materials && materials.length > 0
                                                ? materials.map((mat, i) => (
                                                      <tr
                                                          key={i}
                                                          className="transition-colors hover:bg-muted/30"
                                                      >
                                                          <td className="flex items-center gap-3 px-6 py-4 font-semibold text-foreground">
                                                              <div className="h-2 w-2 rounded-full bg-primary" />
                                                              {mat.name}
                                                          </td>
                                                          <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                                                              {mat.stock.toLocaleString(
                                                                  undefined,
                                                                  {
                                                                      minimumFractionDigits: 1,
                                                                      maximumFractionDigits: 1,
                                                                  },
                                                              )}
                                                          </td>
                                                          <td className="px-6 py-4 text-right font-mono font-bold text-foreground">
                                                              {formatNaira(
                                                                  mat.price,
                                                              ).replace(
                                                                  'NGN',
                                                                  '₦',
                                                              )}
                                                          </td>
                                                          <td className="px-6 py-4 text-right text-muted-foreground">
                                                              {mat.unit}
                                                          </td>
                                                          <td className="px-6 py-4 text-center">
                                                              <Badge variant="outline">
                                                                  Active
                                                              </Badge>
                                                          </td>
                                                      </tr>
                                                  ))
                                                : [
                                                      {
                                                          name: 'Karfe',
                                                          stock: 1020,
                                                          price: 650,
                                                          unit: 'kg',
                                                      },
                                                      {
                                                          name: 'Brass',
                                                          stock: 170,
                                                          price: 4100,
                                                          unit: 'kg',
                                                      },
                                                      {
                                                          name: 'Jar Waya',
                                                          stock: 230,
                                                          price: 2300,
                                                          unit: 'kg',
                                                      },
                                                      {
                                                          name: 'Aluminium',
                                                          stock: 265,
                                                          price: 2500,
                                                          unit: 'kg',
                                                      },
                                                      {
                                                          name: 'Copper',
                                                          stock: 150,
                                                          price: 6500,
                                                          unit: 'kg',
                                                      },
                                                  ].map((mat, i) => (
                                                      <tr
                                                          key={i}
                                                          className="transition-colors hover:bg-muted/30"
                                                      >
                                                          <td className="flex items-center gap-3 px-6 py-4 font-semibold text-foreground">
                                                              <div className="h-2 w-2 rounded-full bg-primary" />
                                                              {mat.name}
                                                          </td>
                                                          <td className="px-6 py-4 text-right font-mono text-muted-foreground">
                                                              {mat.stock.toLocaleString()}
                                                          </td>
                                                          <td className="px-6 py-4 text-right font-mono font-bold text-foreground">
                                                              {formatNaira(
                                                                  mat.price,
                                                              ).replace(
                                                                  'NGN',
                                                                  '₦',
                                                              )}
                                                          </td>
                                                          <td className="px-6 py-4 text-right text-muted-foreground">
                                                              {mat.unit}
                                                          </td>
                                                          <td className="px-6 py-4 text-center">
                                                              <Badge variant="outline">
                                                                  Demo
                                                              </Badge>
                                                          </td>
                                                      </tr>
                                                  ))}
                                        </tbody>
                                    </table>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* DYNAMIC ENVIRONMENTAL IMPACT CALCULATOR */}
                <section className="mx-auto max-w-7xl bg-background px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
                    <div className="grid items-center gap-12 lg:grid-cols-12">
                        {/* Calculator Input Side */}
                        <div className="flex flex-col items-start space-y-6 lg:col-span-6">
                            <Badge variant="secondary" className="gap-1.5 py-1">
                                <Zap className="h-3.5 w-3.5" />
                                Impact Calculator
                            </Badge>
                            <h2 className="text-3xl leading-tight font-extrabold tracking-tight text-foreground sm:text-4xl">
                                Estimate Your <br />
                                <span className="text-muted-foreground">
                                    Environmental Value Offset
                                </span>
                            </h2>
                            <p className="text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Metal recycling significantly reduces greenhouse
                                gas emissions, conserves energy, and saves raw
                                fossil fuels. Drag the slider to simulate the
                                environmental impact of processed scrap weight.
                            </p>

                            {/* Weight Slider Controller */}
                            <Card className="mt-2 w-full border border-border bg-card p-6 shadow-sm">
                                <div className="mb-4 flex items-center justify-between">
                                    <span className="text-sm font-semibold text-foreground">
                                        Simulate Material Weight
                                    </span>
                                    <Badge
                                        variant="outline"
                                        className="px-3 py-1 font-mono text-base font-bold"
                                    >
                                        {calcWeight} kg
                                    </Badge>
                                </div>
                                <input
                                    type="range"
                                    min="50"
                                    max="10000"
                                    step="50"
                                    value={calcWeight}
                                    onChange={(e) =>
                                        setCalcWeight(parseInt(e.target.value))
                                    }
                                    className="h-2 w-full cursor-pointer appearance-none rounded-lg bg-muted accent-primary focus:outline-none"
                                />
                                <div className="flex justify-between pt-2 text-[10px] font-semibold text-muted-foreground uppercase">
                                    <span>50 kg</span>
                                    <span>5,000 kg</span>
                                    <span>10,000 kg</span>
                                </div>
                            </Card>
                        </div>

                        {/* Calculator Outputs Display */}
                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-3 lg:col-span-6">
                            {/* Card 1: CO2 */}
                            <Card className="text-center shadow-sm">
                                <CardHeader className="flex flex-col items-center pt-6">
                                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                                        <Leaf className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        CO₂ Saved
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-6">
                                    <div className="text-2xl font-extrabold text-foreground">
                                        {calculateCo2(calcWeight)}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        kg offset
                                    </span>
                                </CardContent>
                            </Card>

                            {/* Card 2: Energy */}
                            <Card className="text-center shadow-sm">
                                <CardHeader className="flex flex-col items-center pt-6">
                                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                                        <Flame className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Energy Conserved
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-6">
                                    <div className="text-2xl font-extrabold text-foreground">
                                        {calculateEnergy(calcWeight)}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        MWh energy
                                    </span>
                                </CardContent>
                            </Card>

                            {/* Card 3: Coal / Raw Materials */}
                            <Card className="text-center shadow-sm">
                                <CardHeader className="flex flex-col items-center pt-6">
                                    <div className="mb-2 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                                        <Scale className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-[10px] font-bold tracking-wider text-muted-foreground uppercase">
                                        Mining Saved
                                    </CardTitle>
                                </CardHeader>
                                <CardContent className="pb-6">
                                    <div className="text-2xl font-extrabold text-foreground">
                                        {calculateCoal(
                                            calcWeight,
                                        ).toLocaleString()}
                                    </div>
                                    <span className="text-xs text-muted-foreground">
                                        kg resources
                                    </span>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* PLATFORM FEATURES */}
                <section className="border-t border-border bg-muted/20 py-16 sm:py-24">
                    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                        <div className="mx-auto mb-12 flex max-w-3xl flex-col items-center gap-3 text-center">
                            <Badge
                                variant="outline"
                                className="px-3 py-1 text-[10px] font-bold uppercase"
                            >
                                Platform Architecture
                            </Badge>
                            <h2 className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                Unified System For Scrap Business Management
                            </h2>
                            <p className="max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                Engineered to streamline high-volume operational
                                cycles for scrap, material yard weights,
                                payments, and invoices.
                            </p>
                        </div>

                        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
                            {/* Feature 1 */}
                            <Card className="bg-card shadow-sm transition-all hover:shadow-md">
                                <CardHeader className="pb-2">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                                        <Layers className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-lg font-bold text-foreground">
                                        Automated Inventory
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Real-time tracking of stockpiles with
                                        automatic reorder warning flags and
                                        material category breakdown.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Feature 2 */}
                            <Card className="bg-card shadow-sm transition-all hover:shadow-md">
                                <CardHeader className="pb-2">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                                        <DollarSign className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-lg font-bold text-foreground">
                                        Acquisitions & Sales
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Clean, step-by-step cashier workspace
                                        for intake purchasing and sales. Monitor
                                        cash flows instantly.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Feature 3 */}
                            <Card className="bg-card shadow-sm transition-all hover:shadow-md">
                                <CardHeader className="pb-2">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                                        <FileText className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-lg font-bold text-foreground">
                                        PDF Invoices & Docs
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Generate beautifully-styled invoice PDFs
                                        instantly for customers, complete with
                                        secure local file indexing.
                                    </p>
                                </CardContent>
                            </Card>

                            {/* Feature 4 */}
                            <Card className="bg-card shadow-sm transition-all hover:shadow-md">
                                <CardHeader className="pb-2">
                                    <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-lg bg-muted text-foreground">
                                        <ShieldCheck className="h-5 w-5" />
                                    </div>
                                    <CardTitle className="text-lg font-bold text-foreground">
                                        Role Security Audit
                                    </CardTitle>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm leading-relaxed text-muted-foreground">
                                        Complete operational audit log of
                                        administrative, storekeeper, cashier,
                                        and management modifications.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </section>

                {/* CALL TO ACTION */}
                <section className="bg-background py-16 sm:py-24">
                    <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
                        <Card className="border border-border bg-card p-8 text-center shadow-sm sm:p-12">
                            <CardHeader className="flex flex-col items-center gap-2">
                                <CardTitle className="text-3xl font-extrabold tracking-tight text-foreground sm:text-4xl">
                                    Ready to Streamline Your Scrap Business?
                                </CardTitle>
                                <CardDescription className="mt-2 max-w-xl text-sm leading-relaxed text-muted-foreground sm:text-base">
                                    Join our network of operational managers.
                                    Maximize resource recoveries, eliminate
                                    bookkeeping errors, and scale scrap yards
                                    with precision ledger software.
                                </CardDescription>
                            </CardHeader>
                            <CardContent className="flex justify-center pt-6">
                                {auth?.user ? (
                                    <Link href={dashboard()}>
                                        <Button
                                            size="lg"
                                            className="px-8 font-semibold"
                                        >
                                            Go to Dashboard
                                        </Button>
                                    </Link>
                                ) : (
                                    <Link href={login()}>
                                        <Button
                                            size="lg"
                                            className="px-8 font-semibold"
                                        >
                                            Sign In as Operator
                                        </Button>
                                    </Link>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </section>

                {/* FOOTER */}
                <footer className="border-t border-border bg-muted/40 py-12 text-sm text-muted-foreground">
                    <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-6 px-4 sm:flex-row sm:px-6 lg:px-8">
                        <div className="flex items-center gap-2">
                            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground">
                                <Recycle className="h-4 w-4" />
                            </div>
                            <span className="font-bold text-foreground">
                                Salepost
                            </span>
                        </div>
                        <p className="text-xs">
                            © {new Date().getFullYear()} Salepost Scrap ERP. All
                            rights reserved. Built for Nigerian Business
                            Operators.
                        </p>
                    </div>
                </footer>

                <AIAssistant />
            </div>
        </>
    );
}
