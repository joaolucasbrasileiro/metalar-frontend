import { HomeHeader } from "./components/HomeHeader";
import { HeroCarousel } from "./components/HeroCarousel";
import { BenefitBar } from "./components/BenefitBar";

export function HomePage() {
    return (
        <main className="min-h-screen bg-zinc-100 text-zinc-950">
            <HomeHeader />
            <HeroCarousel />
            <BenefitBar />
        </main>
    );
}