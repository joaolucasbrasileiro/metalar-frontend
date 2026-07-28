"use client";

import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

import type { AccountView } from "./AccountDashboard";

type AccountBreadcrumbProps = {
    activeView: AccountView;
    onNavigateHome: () => void;
};

const viewLabels: Record<AccountView, string> = {
    actions: "Minha Conta",
    profile: "Editar dados",
    security: "Senha e segurança",
};

export function AccountBreadcrumb({
    activeView,
    onNavigateHome,
}: AccountBreadcrumbProps) {
    const isAccountHome = activeView === "actions";

    return (
        <nav
            aria-label="Breadcrumb"
            className="flex flex-wrap items-center gap-3 text-xs font-semibold text-zinc-700"
        >
            <Link
                href="/"
                aria-label="Página inicial"
                className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white"
            >
                <Home className="h-4 w-4" strokeWidth={2} />
            </Link>

            <ChevronRight className="h-4 w-4 text-zinc-500" strokeWidth={2} />

            {isAccountHome ? (
                <span>Minha Conta</span>
            ) : (
                <>
                    <button
                        type="button"
                        onClick={onNavigateHome}
                        className="rounded-[6px] px-2 py-1 transition-colors hover:bg-white hover:text-zinc-950"
                    >
                        Minha Conta
                    </button>

                    <ChevronRight className="h-4 w-4 text-zinc-500" strokeWidth={2} />
                    <span>{viewLabels[activeView]}</span>
                </>
            )}
        </nav>
    );
}
