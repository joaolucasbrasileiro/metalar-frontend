
import { Box, CreditCard, Store, WalletCards } from "lucide-react";

const benefits = [
    {
        id: "stock",
        icon: Box,
        title: "O Maior Estoque",
        description: "De Guanambi!",
    },
    {
        id: "stores",
        icon: Store,
        title: "Mais de 20 anos",
        description: "Na região.",
    },
    {
        id: "installments",
        icon: CreditCard,
        title: "Até 12x",
        description: "Em todos os cartões.",
    },
    {
        id: "credit",
        icon: WalletCards,
        title: "Crediário próprio",
        description: "",
    },
];

export function BenefitBar() {
    return (
        <section className="bg-zinc-100 pb-8 pt-7">
            <div className="mx-auto grid max-w-[1180px] grid-cols-1 gap-4 rounded-[10px] border border-zinc-300 bg-white px-8 py-5 shadow-sm sm:grid-cols-2 lg:grid-cols-4 lg:gap-8">
                {benefits.map((benefit) => {
                    const Icon = benefit.icon;

                    return (
                        <div key={benefit.id} className="flex items-center justify-center gap-3">
                            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-[4px] bg-zinc-950 text-white">
                                <Icon
                                    className="h-5 w-5"
                                    strokeWidth={2}
                                    aria-hidden="true"
                                />
                            </span>

                            <div>
                                <strong className="block text-sm font-bold leading-tight text-zinc-950">
                                    {benefit.title}
                                </strong>

                                {benefit.description && (
                                    <span className="block text-sm leading-tight text-zinc-900">
                                        {benefit.description}
                                    </span>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </section>
    );
}
