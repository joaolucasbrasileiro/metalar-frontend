import { HomeFooter } from "@/features/layout/components/HomeFooter";
import { HomeHeader } from "@/features/layout/components/HomeHeader";

import { AccountDashboard } from "./components/AccountDashboard";

export function AccountPage() {
    return (
        <main className="min-h-screen bg-[#f6f6f6] text-zinc-950">
            <HomeHeader />

            <section className="mx-auto max-w-[1320px] px-4 py-6 sm:px-[25px] lg:py-8">
                <AccountDashboard />
            </section>

            <HomeFooter />
        </main>
    );
}
