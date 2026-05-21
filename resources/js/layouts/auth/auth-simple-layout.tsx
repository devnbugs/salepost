import { Link } from '@inertiajs/react';
import { Recycle } from 'lucide-react';
import { home } from '@/routes';
import type { AuthLayoutProps } from '@/types';

export default function AuthSimpleLayout({
    children,
    title,
    description,
}: AuthLayoutProps) {
    return (
        <div className="relative flex min-h-svh flex-col items-center justify-center gap-6 overflow-hidden bg-[#070807] p-6 font-sans text-[#ecf0ec] md:p-10">
            {/* Visual Background Glow Elements */}
            <div className="pointer-events-none absolute top-[-10%] left-[-10%] h-[50%] w-[50%] rounded-full bg-emerald-950/25 blur-[150px]" />
            <div className="pointer-events-none absolute right-[-10%] bottom-[-10%] h-[50%] w-[50%] rounded-full bg-teal-950/25 blur-[150px]" />

            <div className="relative z-10 w-full max-w-md">
                <div className="flex flex-col gap-6">
                    <div className="flex flex-col items-center gap-4">
                        <Link
                            href={home()}
                            className="group flex flex-col items-center gap-2 transition-transform duration-300 hover:scale-105"
                        >
                            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-400 shadow-[0_0_20px_rgba(16,185,129,0.3)] transition-shadow duration-300 group-hover:shadow-[0_0_25px_rgba(16,185,129,0.5)]">
                                <Recycle className="h-6 w-6 text-black" />
                            </div>
                            <div className="mt-2 flex items-center gap-1.5">
                                <span className="bg-gradient-to-r from-white via-neutral-200 to-neutral-400 bg-clip-text text-xl font-bold tracking-tight text-transparent">
                                    Salepost
                                </span>
                                <span className="rounded-full border border-emerald-500/20 bg-emerald-500/10 px-2 py-0.5 text-[9px] font-semibold tracking-wider text-emerald-400 uppercase">
                                    Scrap ERP
                                </span>
                            </div>
                        </Link>

                        <div className="mt-2 max-w-xs space-y-1.5 text-center">
                            <h1 className="text-2xl font-bold tracking-tight text-white">
                                {title}
                            </h1>
                            <p className="text-sm leading-relaxed text-neutral-400">
                                {description}
                            </p>
                        </div>
                    </div>

                    <div className="relative overflow-hidden rounded-3xl border border-[#1b201b] bg-[#0d0f0d]/95 p-6 shadow-[0_20px_50px_rgba(0,0,0,0.6)] backdrop-blur-md sm:p-8">
                        <div className="pointer-events-none absolute top-0 right-0 h-32 w-32 rounded-full bg-emerald-500/5 blur-2xl" />
                        {children}
                    </div>
                </div>
            </div>
        </div>
    );
}
