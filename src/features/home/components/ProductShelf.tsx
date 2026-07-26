"use client";

import { useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

import type { HomeProduct } from "../data";
import { ProductCard } from "./ProductCard";

type ProductShelfProps = {
    products: HomeProduct[];
};

export function ProductShelf({ products }: ProductShelfProps) {
    const carouselRef = useRef<HTMLDivElement>(null);

    function scrollCarousel(direction: "previous" | "next") {
        const carousel = carouselRef.current;

        if (!carousel) {
            return;
        }

        const distance = carousel.clientWidth * 0.82;

        carousel.scrollBy({
            left: direction === "next" ? distance : -distance,
            behavior: "smooth",
        });
    }

    return (
        <section className="bg-zinc-100 pb-9 pt-2 sm:pb-12">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-0">
                <div className="mb-5 flex items-center justify-between gap-4">
                    <h2 className="text-xl font-extrabold text-zinc-950 sm:text-2xl">
                        Mais Vendidos
                    </h2>

                    <a
                        href="/mais-vendidos"
                        className="text-sm font-bold text-zinc-950 transition-colors hover:text-[#D71920]"
                    >
                        Ver todos &gt;
                    </a>
                </div>

                {products.length > 0 ? (
                    <div className="group relative">
                        <button
                            type="button"
                            aria-label="Ver produtos anteriores"
                            onClick={() => scrollCarousel("previous")}
                            className="absolute left-0 top-1/2 z-10 hidden h-11 w-11 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-950 shadow-md transition-colors hover:bg-zinc-50 lg:grid"
                        >
                            <ChevronLeft className="h-5 w-5" strokeWidth={2.4} />
                        </button>

                        <div
                            ref={carouselRef}
                            className="flex gap-4 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                        >
                            {products.map((product) => (
                                <ProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <button
                            type="button"
                            aria-label="Ver próximos produtos"
                            onClick={() => scrollCarousel("next")}
                            className="absolute right-0 top-1/2 z-10 hidden h-11 w-11 -translate-y-1/2 translate-x-1/2 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-950 shadow-md transition-colors hover:bg-zinc-50 lg:grid"
                        >
                            <ChevronRight className="h-5 w-5" strokeWidth={2.4} />
                        </button>
                    </div>
                ) : (
                    <div className="rounded-[8px] border border-dashed border-zinc-300 bg-white px-5 py-8 text-center text-sm font-medium text-zinc-500">
                        Nenhum produto vendido encontrado.
                    </div>
                )}
            </div>
        </section>
    );
}
