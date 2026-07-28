import Link from "next/link";

import { accountActions } from "../data";

export function AccountActionGrid() {
    return (
        <section>
            <div className="flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between">
                <div>
                    <h2 className="text-lg font-extrabold text-zinc-950">
                        Funcionalidades
                    </h2>
                    <p className="mt-1 text-sm font-semibold text-zinc-600">
                        Pedidos, favoritos, endereços e atendimento.
                    </p>
                </div>
            </div>

            <div className="mt-5 grid gap-4 sm:grid-cols-2">
                {accountActions.map((action) => {
                    const Icon = action.icon;
                    const content = (
                        <>
                            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[6px] bg-[#FFD900] text-zinc-950">
                                <Icon className="h-6 w-6" strokeWidth={2.2} />
                            </span>
                            <span className="min-w-0">
                                <span className="flex flex-wrap items-center gap-2">
                                    <strong className="text-sm font-extrabold text-zinc-950">
                                        {action.title}
                                    </strong>
                                    {action.status && (
                                        <span className="rounded-[4px] bg-zinc-100 px-2 py-1 text-[11px] font-extrabold text-zinc-600">
                                            {action.status}
                                        </span>
                                    )}
                                </span>
                                <span className="mt-1 block text-sm font-medium leading-relaxed text-zinc-600">
                                    {action.description}
                                </span>
                            </span>
                        </>
                    );

                    if (action.href) {
                        return (
                            <Link
                                key={action.title}
                                href={action.href}
                                className="flex min-h-[120px] gap-4 rounded-[8px] border border-zinc-200 bg-white p-5 transition-colors hover:border-zinc-300 hover:bg-zinc-50"
                            >
                                {content}
                            </Link>
                        );
                    }

                    return (
                        <div
                            key={action.title}
                            className="flex min-h-[120px] gap-4 rounded-[8px] border border-zinc-200 bg-white p-5"
                        >
                            {content}
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
