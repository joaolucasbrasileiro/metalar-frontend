import { HomeHeader } from "./components/HomeHeader";
import { HeroCarousel } from "./components/HeroCarousel";
import { BenefitBar } from "./components/BenefitBar";
import { ProductShelf } from "./components/ProductShelf";
import { getBestSellerProducts } from "./data";

export async function HomePage() {
    const bestSellerProducts = await getBestSellerProducts();

    return (
        <main className="min-h-screen bg-zinc-100 text-zinc-950">
            <HomeHeader />
            <HeroCarousel />
            <BenefitBar />
            <ProductShelf products={bestSellerProducts} />
        </main>
    );
}
