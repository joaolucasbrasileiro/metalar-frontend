import { HomeFooter } from "@/features/layout/components/HomeFooter";
import { HomeHeader } from "@/features/layout/components/HomeHeader";

import { SigninForm } from "./components/SigninForm";
import { SigninHeroCard } from "./components/SigninHeroCard";

export function SigninPage() {
    return (
        <main className="min-h-screen bg-[#f6f6f6] text-zinc-950">
            <HomeHeader />

            <section className="mx-auto max-w-[1320px] px-4 py-6 sm:px-[25px] lg:py-8">
                <div className="overflow-hidden rounded-[8px] border border-zinc-200 bg-white shadow-sm">
                    <div className="grid lg:min-h-[640px] lg:grid-cols-[0.86fr_1.14fr]">
                        <SigninForm />
                        <SigninHeroCard />
                    </div>
                </div>
            </section>

            <HomeFooter />
        </main>
    );
}
