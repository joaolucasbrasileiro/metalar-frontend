import { HomeHeader } from "./components/HomeHeader";
import { HeroCarousel } from "./components/HeroCarousel";
import { BenefitBar } from "./components/BenefitBar";
import { ProductShelf } from "./components/ProductShelf";
import { ProductGrid } from "./components/ProductGrid";
import { HomeFooter } from "./components/HomeFooter";
import { getBestSellerProducts, getProductsPage } from "./data";

type HomePageProps = {
    currentProductPage: number;
};

export async function HomePage({ currentProductPage }: HomePageProps) {
    const [bestSellerProducts, productsPage] = await Promise.all([
        getBestSellerProducts(),
        getProductsPage(currentProductPage),
    ]);

    return (
        <main className="min-h-screen bg-zinc-100 text-zinc-950">
            <HomeHeader />
            <HeroCarousel />
            <BenefitBar />
            <ProductShelf products={bestSellerProducts} />
            <ProductGrid productsPage={productsPage} />
            <HomeFooter />
        </main>
    );
}
