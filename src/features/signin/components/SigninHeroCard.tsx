import Image from "next/image";

import { SigninBenefitsCard } from "./SigninBenefitsCard";

export function SigninHeroCard() {
    return (
        <section className="relative hidden min-h-[560px] overflow-hidden border-t border-zinc-100 bg-white lg:block lg:border-l lg:border-t-0">
            <div
                aria-hidden="true"
                className="absolute inset-0 bg-[linear-gradient(90deg,#ffffff_0%,rgba(255,255,255,0.78)_34%,rgba(255,255,255,0.28)_100%)]"
            />

            <div className="absolute inset-x-0 bottom-[190px] top-3">
                <Image
                    src="/signin.png"
                    alt="Profissional da Metalar com materiais de construção"
                    fill
                    sizes="720px"
                    className="scale-[1.08] object-contain object-bottom"
                    priority
                />
            </div>

            <SigninBenefitsCard />
        </section>
    );
}
