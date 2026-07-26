import Image from "next/image";
import Link from "next/link";
import { Heart, Package, ShoppingCart, Star } from "lucide-react";

import type { HomeProduct, ProductsPage } from "../data";

type ProductGridProps = {
    productsPage: ProductsPage;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export function ProductGrid({ productsPage }: ProductGridProps) {
    const { products, currentPage, lastPage, total } = productsPage;
    const hasPreviousPage = currentPage > 1;
    const hasNextPage = currentPage < lastPage;

    return (
        <section className="bg-zinc-100 pb-14">
            <div className="mx-auto max-w-[1180px] px-4 sm:px-6 lg:px-0">
                <div className="mb-5 flex flex-wrap items-end justify-between gap-3">
                    <div>
                        <h2 className="text-xl font-extrabold text-zinc-950 sm:text-2xl">
                            Produtos
                        </h2>

                        <p className="mt-1 text-sm font-medium text-zinc-500">
                            {total > 0 ? `${total} produtos encontrados` : "Catálogo em atualização"}
                        </p>
                    </div>
                </div>

                {products.length > 0 ? (
                    <>
                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                            {products.map((product) => (
                                <CatalogProductCard key={product.id} product={product} />
                            ))}
                        </div>

                        <nav
                            aria-label="Paginação de produtos"
                            className="mt-8 flex items-center justify-center gap-3"
                        >
                            {hasPreviousPage ? (
                                <Link
                                    href={getPageHref(currentPage - 1)}
                                    className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300 bg-white text-lg font-bold text-zinc-950 transition-colors hover:border-[#FFD900] hover:bg-[#FFD900]"
                                    aria-label="Ir para página anterior"
                                >
                                    &lt;
                                </Link>
                            ) : (
                                <span className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white text-lg font-bold text-zinc-300">
                                    &lt;
                                </span>
                            )}

                            <span className="min-w-32 rounded-full border border-zinc-200 bg-white px-5 py-2 text-center text-sm font-bold text-zinc-950">
                                Página {currentPage} de {lastPage}
                            </span>

                            {hasNextPage ? (
                                <Link
                                    href={getPageHref(currentPage + 1)}
                                    className="grid h-10 w-10 place-items-center rounded-full border border-zinc-300 bg-white text-lg font-bold text-zinc-950 transition-colors hover:border-[#FFD900] hover:bg-[#FFD900]"
                                    aria-label="Ir para próxima página"
                                >
                                    &gt;
                                </Link>
                            ) : (
                                <span className="grid h-10 w-10 place-items-center rounded-full border border-zinc-200 bg-white text-lg font-bold text-zinc-300">
                                    &gt;
                                </span>
                            )}
                        </nav>
                    </>
                ) : (
                    <div className="rounded-[8px] border border-dashed border-zinc-300 bg-white px-5 py-10 text-center text-sm font-medium text-zinc-500">
                        Nenhum produto encontrado.
                    </div>
                )}
            </div>
        </section>
    );
}

function CatalogProductCard({ product }: { product: HomeProduct }) {
    const installmentPrice = product.price ? product.price / 10 : null;

    return (
        <article className="group flex min-h-[430px] flex-col rounded-[8px] border border-zinc-200 bg-white p-4 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-[#FFD900] hover:shadow-lg hover:shadow-zinc-200">
            <div className="relative grid h-[210px] place-items-center overflow-hidden rounded-[6px] bg-white">
                <a href={product.href} className="absolute inset-0 z-10" aria-label={product.name} />

                {product.imageUrl ? (
                    <Image
                        src={product.imageUrl}
                        alt={product.imageAlt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 280px"
                        className="object-contain p-3 transition-transform duration-300 group-hover:scale-105"
                    />
                ) : (
                    <Package
                        className="h-14 w-14 text-zinc-300 transition-colors duration-300 group-hover:text-[#FFD900]"
                        strokeWidth={1.6}
                        aria-hidden="true"
                    />
                )}

                <button
                    type="button"
                    aria-label={`Adicionar ${product.name} aos favoritos`}
                    className="absolute right-2 top-2 z-20 grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-300 transition-colors duration-200 hover:border-[#FFD900] hover:text-[#D71920]"
                >
                    <Heart className="h-5 w-5" strokeWidth={2} />
                </button>
            </div>

            <div className="mt-3 flex items-center gap-1 text-[#FFD900]">
                {Array.from({ length: 5 }).map((_, index) => (
                    <Star key={index} className="h-4 w-4 fill-current" strokeWidth={1.7} />
                ))}

                <span className="ml-1 text-xs font-semibold text-zinc-400">0.0</span>
            </div>

            <a href={product.href} className="mt-2 block">
                <h3 className="line-clamp-2 min-h-[44px] text-sm font-bold leading-snug text-zinc-950 transition-colors duration-200 group-hover:text-[#D71920]">
                    {product.name}
                </h3>
            </a>

            <div className="mt-auto pt-3">
                {product.regularPrice && (
                    <span className="block text-xs font-semibold text-zinc-400 line-through">
                        {currencyFormatter.format(product.regularPrice)}
                    </span>
                )}

                <div className="flex flex-wrap items-center gap-2">
                    <strong className="text-xl font-extrabold text-zinc-950">
                        {product.price !== null ? currencyFormatter.format(product.price) : "Consultar"}
                    </strong>

                    {product.isPromotion && product.regularPrice && product.price && (
                        <span className="rounded-full bg-[#D71920] px-2 py-0.5 text-xs font-extrabold text-white">
                            {formatDiscount(product.regularPrice, product.price)}
                        </span>
                    )}
                </div>

                {product.price !== null && (
                    <p className="mt-1 text-xs font-semibold leading-snug text-zinc-700">
                        à vista no boleto ou PIX
                        {installmentPrice && (
                            <span className="block font-medium text-zinc-500">
                                ou 10x de <strong>{currencyFormatter.format(installmentPrice)}</strong> sem juros
                            </span>
                        )}
                    </p>
                )}

                <button
                    type="button"
                    className="mt-4 flex h-11 w-full translate-y-2 items-center justify-center gap-2 rounded-[4px] bg-[#FFD900] px-4 text-sm font-extrabold text-zinc-950 opacity-100 transition-all duration-300 hover:bg-[#E8C600] sm:opacity-0 sm:group-hover:translate-y-0 sm:group-hover:opacity-100"
                >
                    <ShoppingCart className="h-4 w-4" strokeWidth={2.3} />
                    Comprar agora
                </button>
            </div>
        </article>
    );
}

function getPageHref(page: number) {
    return page <= 1 ? "/" : `/?page=${page}`;
}

function formatDiscount(regularPrice: number, price: number) {
    const discount = Math.round(((regularPrice - price) / regularPrice) * 100);

    return `-${discount}%`;
}
