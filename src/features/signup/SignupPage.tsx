import { HomeFooter } from "@/features/layout/components/HomeFooter";
import { HomeHeader } from "@/features/layout/components/HomeHeader";

import { SignupBreadcrumb } from "./components/SignupBreadcrumb";
import { SignupForm } from "./components/SignupForm";
import { SignupHeroCard } from "./components/SignupHeroCard";
import { SignupTrustBar } from "./components/SignupTrustBar";

export function SignupPage() {
    return (
        <main className="min-h-screen bg-[#f6f6f6] text-zinc-950">
            <HomeHeader />

            <section className="mx-auto max-w-[1320px] px-4 py-6 sm:px-[25px] lg:py-8">
                <SignupBreadcrumb />

                <div className="grid gap-5 lg:grid-cols-[1.08fr_0.88fr]">
                    <SignupHeroCard />
                    <SignupForm />
                </div>

                <SignupTrustBar />
            </section>

            <HomeFooter />
        </main>
    );
}
