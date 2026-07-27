import Image from "next/image";
import { Heart } from "lucide-react";

import { signupBenefits } from "../data";

export function SignupHeroCard() {
    return (
        <section className="relative overflow-hidden rounded-[8px] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10 lg:min-h-[510px]">
            <div className="relative z-10 max-w-[360px]">
                <h1 className="text-[34px] font-extrabold leading-[1.08] text-zinc-950 sm:text-[42px]">
                    Crie sua conta na Metalar e{" "}
                    <span className="text-[#f2c500]">construa mais vantagens.</span>
                </h1>

                <p className="mt-4 max-w-[280px] text-base font-medium leading-relaxed text-zinc-600">
                    É rápido, seguro e gratuito. Aproveite uma experiência completa feita
                    para você.
                </p>

                <div className="mt-6 grid max-w-[330px] gap-3">
                    {signupBenefits.map((benefit) => {
                        const Icon = benefit.icon;

                        return (
                            <div
                                key={benefit.title}
                                className="flex items-center gap-4 rounded-[8px] border border-zinc-200 bg-white/90 p-4 shadow-sm"
                            >
                                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-[6px] bg-[#fff3b8] text-zinc-950">
                                    <Icon
                                        className="h-6 w-6"
                                        strokeWidth={2.2}
                                        fill={benefit.icon === Heart ? "#FFD900" : "none"}
                                    />
                                </span>
                                <span>
                                    <strong className="block text-sm font-extrabold">
                                        {benefit.title}
                                    </strong>
                                    <span className="mt-0.5 block text-xs font-medium leading-snug text-zinc-600">
                                        {benefit.description}
                                    </span>
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>

            <div
                aria-hidden="true"
                className="absolute bottom-0 right-0 hidden h-[470px] w-[470px] lg:block"
            >
                <Image
                    src="/signup.png"
                    alt=""
                    fill
                    sizes="470px"
                    className="object-contain object-bottom"
                    priority
                />
            </div>
        </section>
    );
}
