import {
    Award,
    BadgeCheck,
    Barcode,
    CreditCard,
    Landmark,
    Mail,
    MapPin,
    MessageCircle,
    ShieldCheck,
    Smartphone,
    Star,
} from "lucide-react";

const paymentMethods = [
    { id: "pix", label: "PIX", icon: Smartphone },
    { id: "boleto", label: "Boleto", icon: Barcode },
    { id: "deposito", label: "Depósito", icon: Landmark },
    { id: "cartao", label: "Cartões", icon: CreditCard },
];

const trustItems = [
    { id: "secure", label: "Compra segura", icon: ShieldCheck },
    { id: "quality", label: "Qualidade Metalar", icon: Award },
    { id: "support", label: "Atendimento local", icon: BadgeCheck },
];

export function HomeFooter() {
    return (
        <footer className="border-t-4 border-[#FFD900] bg-zinc-950 text-white">
            <div className="mx-auto grid max-w-[1180px] gap-10 px-4 py-10 sm:px-6 lg:grid-cols-[1fr_0.85fr] lg:px-0">
                <div>
                    <h2 className="text-lg font-extrabold text-[#FFD900]">
                        Formas de pagamento
                    </h2>

                    <div className="mt-5 flex flex-wrap gap-3">
                        {paymentMethods.map((method) => {
                            const Icon = method.icon;

                            return (
                                <div
                                    key={method.id}
                                    className="flex h-12 min-w-28 items-center gap-2 rounded-[6px] border border-white/10 bg-white px-3 text-zinc-950 shadow-sm"
                                >
                                    <Icon
                                        className="h-5 w-5 text-[#D71920]"
                                        strokeWidth={2.2}
                                        aria-hidden="true"
                                    />
                                    <span className="text-sm font-extrabold">
                                        {method.label}
                                    </span>
                                </div>
                            );
                        })}
                    </div>

                    <p className="mt-5 max-w-2xl text-sm leading-relaxed text-zinc-300">
                        Pague com praticidade no PIX, boleto ou cartão. Consulte condições
                        de parcelamento, disponibilidade e crediário diretamente no atendimento.
                    </p>
                </div>

                <div>
                    <h2 className="text-lg font-extrabold text-[#FFD900]">
                        Reputação e atendimento
                    </h2>

                    <div className="mt-5 grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                        {trustItems.map((item) => {
                            const Icon = item.icon;

                            return (
                                <div
                                    key={item.id}
                                    className="flex items-center gap-3 rounded-[6px] border border-white/10 bg-white/5 px-4 py-3"
                                >
                                    <span className="grid h-9 w-9 shrink-0 place-items-center rounded-[4px] bg-[#FFD900] text-zinc-950">
                                        <Icon
                                            className="h-5 w-5"
                                            strokeWidth={2.2}
                                            aria-hidden="true"
                                        />
                                    </span>
                                    <strong className="text-sm font-extrabold">
                                        {item.label}
                                    </strong>
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>

            <div className="border-t border-white/10">
                <div className="mx-auto flex max-w-[1180px] flex-col gap-5 px-4 py-6 text-sm text-zinc-300 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-0">
                    <div className="grid gap-2 sm:grid-cols-3 lg:flex lg:items-center lg:gap-5">
                        <span className="flex items-center gap-2">
                            <MapPin className="h-4 w-4 text-[#FFD900]" strokeWidth={2.2} />
                            Guanambi e região
                        </span>

                        <a
                            href="mailto:atendimento@metalar.com"
                            className="flex items-center gap-2 transition-colors hover:text-[#FFD900]"
                        >
                            <Mail className="h-4 w-4 text-[#FFD900]" strokeWidth={2.2} />
                            atendimento@metalar.com
                        </a>

                        <a
                            href="#"
                            className="flex items-center gap-2 transition-colors hover:text-[#FFD900]"
                        >
                            <MessageCircle className="h-4 w-4 text-[#FFD900]" strokeWidth={2.2} />
                            Fale conosco
                        </a>
                    </div>

                    <div className="flex items-center gap-2 text-zinc-400">
                        <span>Copyright © 2026 Metalar.</span>
                        <span className="hidden sm:inline">Todos os direitos reservados.</span>
                        <Star className="h-4 w-4 fill-[#FFD900] text-[#FFD900]" strokeWidth={1.8} />
                    </div>
                </div>
            </div>
        </footer>
    );
}
