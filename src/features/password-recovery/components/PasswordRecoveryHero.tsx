import Image from "next/image";
import { MailCheck, ShieldCheck, TimerReset } from "lucide-react";

const recoveryBenefits = [
    {
        title: "Link por e-mail",
        description: "Enviamos as instruções para o endereço cadastrado.",
        icon: MailCheck,
    },
    {
        title: "Acesso protegido",
        description: "A troca de senha exige um token único.",
        icon: ShieldCheck,
    },
    {
        title: "Processo rápido",
        description: "Depois de alterar, você já pode entrar novamente.",
        icon: TimerReset,
    },
];

export function PasswordRecoveryHero() {
    return (
        <section className="relative hidden min-h-[520px] overflow-hidden border-t border-zinc-100 bg-white lg:block lg:border-l lg:border-t-0">
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.78)_34%,rgba(255,255,255,0.26)_100%)]"
            />

            <div className="absolute inset-x-0 bottom-[178px] top-3">
                <Image
                    src="/signin.png"
                    alt="Profissional da Metalar com materiais de construção"
                    fill
                    sizes="720px"
                    className="scale-[1.04] object-contain object-bottom"
                    priority
                />
            </div>

            <div className="absolute bottom-8 left-8 right-8 rounded-[8px] border border-zinc-200 bg-white/95 p-6 shadow-sm backdrop-blur">
                <div className="grid grid-cols-3">
                    {recoveryBenefits.map((benefit, index) => {
                        const Icon = benefit.icon;

                        return (
                            <div
                                key={benefit.title}
                                className={`px-6 ${index > 0 ? "border-l border-zinc-200" : ""}`}
                            >
                                <span className="grid h-11 w-11 place-items-center rounded-[6px] bg-[#fff3b8] text-zinc-950">
                                    <Icon className="h-6 w-6" strokeWidth={2.2} />
                                </span>
                                <strong className="mt-4 block text-sm font-extrabold">
                                    {benefit.title}
                                </strong>
                                <span className="mt-1 block text-xs font-medium leading-relaxed text-zinc-600">
                                    {benefit.description}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}
