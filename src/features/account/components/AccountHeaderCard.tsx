import { ShieldCheck, UserRound } from "lucide-react";

import type { AccountUser } from "./AccountDashboard";

type AccountHeaderCardProps = {
    user: AccountUser;
};

export function AccountHeaderCard({ user }: AccountHeaderCardProps) {
    return (
        <section className="rounded-[8px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-8">
            <div className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center gap-4">
                    <span className="grid h-14 w-14 shrink-0 place-items-center rounded-[8px] bg-[#FFD900] text-zinc-950">
                        <UserRound className="h-8 w-8" strokeWidth={2.2} />
                    </span>

                    <div>
                        <p className="text-sm font-extrabold text-zinc-500">
                            Minha Conta
                        </p>
                        <h1 className="mt-1 text-2xl font-extrabold leading-tight text-zinc-950 sm:text-3xl">
                            {user.name}
                        </h1>
                        <p className="mt-1 text-sm font-semibold text-zinc-600">
                            {user.email}
                        </p>
                    </div>
                </div>

                <div className="flex items-center gap-3 rounded-[6px] border border-zinc-200 bg-zinc-50 px-4 py-3">
                    <ShieldCheck className="h-5 w-5 shrink-0 text-zinc-950" strokeWidth={2.2} />
                    <span className="grid gap-0.5">
                        <strong className="text-sm font-extrabold text-zinc-900">
                            Conta segura
                        </strong>
                        <span className="text-xs font-semibold text-zinc-500">
                            Sessão protegida
                        </span>
                    </span>
                </div>
            </div>
        </section>
    );
}
