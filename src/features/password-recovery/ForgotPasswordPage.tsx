import { HomeFooter } from "@/features/layout/components/HomeFooter";
import { HomeHeader } from "@/features/layout/components/HomeHeader";

import { ForgotPasswordForm } from "./components/ForgotPasswordForm";
import { PasswordRecoveryBreadcrumb } from "./components/PasswordRecoveryBreadcrumb";
import { PasswordRecoveryHero } from "./components/PasswordRecoveryHero";

export function ForgotPasswordPage() {
    return (
        <main className="min-h-screen bg-[#f6f6f6] text-zinc-950">
            <HomeHeader />

            <section className="mx-auto max-w-[1320px] px-4 py-6 sm:px-[25px] lg:py-8">
                <PasswordRecoveryBreadcrumb currentPage="Recuperar senha" />

                <div className="overflow-hidden rounded-[8px] border border-zinc-200 bg-white shadow-sm">
                    <div className="grid lg:min-h-[560px] lg:grid-cols-[0.92fr_1.08fr]">
                        <ForgotPasswordForm />
                        <PasswordRecoveryHero />
                    </div>
                </div>
            </section>

            <HomeFooter />
        </main>
    );
}
