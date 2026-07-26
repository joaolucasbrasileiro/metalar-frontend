import Image from "next/image";
import { Minus, Package, Plus, ShoppingCart } from "lucide-react";

import type { HomeProduct } from "../data";

type ProductCardProps = {
    product: HomeProduct;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export function ProductCard({ product }: ProductCardProps) {
    const isSvgImage = product.imageUrl?.endsWith(".svg") ?? false;
    const regularPriceLabel = product.regularPrice
        ? currencyFormatter.format(product.regularPrice)
        : "\u00a0";
    const soldQuantityLabel =
        product.soldQuantity !== null
            ? `${formatSoldQuantity(product.soldQuantity)} vendidos`
            : "\u00a0";

    return (
        <article className="flex h-[430px] w-[176px] shrink-0 snap-start flex-col rounded-[8px] border border-zinc-200 bg-white p-3 shadow-sm transition-all duration-200 hover:border-[#FFD900] hover:shadow-md sm:w-[196px] lg:w-[210px]">
            <a href={product.href} className="block">
                <div className="relative grid h-[178px] w-full place-items-center overflow-hidden rounded-[6px] bg-zinc-50 sm:h-[198px] lg:h-[210px]">
                    {product.imageUrl ? (
                        <Image
                            src={product.imageUrl}
                            alt={product.imageAlt}
                            fill
                            sizes="(max-width: 640px) 176px, (max-width: 1024px) 196px, 210px"
                            unoptimized={isSvgImage}
                            className="object-contain p-2"
                        />
                    ) : (
                        <Package
                            className="h-12 w-12 text-zinc-300"
                            strokeWidth={1.6}
                            aria-hidden="true"
                        />
                    )}

                    {product.salesRank && (
                        <span className="absolute left-2 top-2 rounded-[4px] bg-[#FFD900] px-2 py-1 text-[11px] font-bold leading-none text-zinc-950">
                            #{product.salesRank}
                        </span>
                    )}
                </div>

                <div className="mt-3 h-[70px]">
                    <h3 className="line-clamp-2 text-sm font-semibold leading-snug text-zinc-900">
                        {product.name}
                    </h3>

                    {product.unit && (
                        <span className="mt-1 block truncate text-xs font-medium text-zinc-500">
                            Unidade: {product.unit}
                        </span>
                    )}
                </div>
            </a>

            <div className="mt-auto flex h-[112px] flex-col justify-end pt-3">
                <span className="block h-4 text-xs font-medium text-zinc-400 line-through">
                    {regularPriceLabel}
                </span>

                <strong className="block text-base font-extrabold text-zinc-950">
                    {product.price !== null ? currencyFormatter.format(product.price) : "Consultar"}
                </strong>

                <span className="mt-1 block h-4 text-[11px] font-medium text-zinc-500">
                    {soldQuantityLabel}
                </span>

                <div className="mt-3 flex items-center justify-between gap-2">
                    <div className="flex h-8 items-center rounded-[4px] border border-zinc-200 bg-zinc-50">
                        <button
                            type="button"
                            aria-label={`Diminuir quantidade de ${product.name}`}
                            className="grid h-8 w-8 place-items-center text-zinc-600 transition-colors hover:text-zinc-950"
                        >
                            <Minus className="h-3.5 w-3.5" strokeWidth={2.3} />
                        </button>

                        <span className="w-6 text-center text-xs font-bold text-zinc-950">1</span>

                        <button
                            type="button"
                            aria-label={`Aumentar quantidade de ${product.name}`}
                            className="grid h-8 w-8 place-items-center text-zinc-600 transition-colors hover:text-zinc-950"
                        >
                            <Plus className="h-3.5 w-3.5" strokeWidth={2.3} />
                        </button>
                    </div>

                    <button
                        type="button"
                        aria-label={`Adicionar ${product.name} ao carrinho`}
                        className="grid h-8 w-9 place-items-center rounded-[4px] bg-[#FFD900] text-zinc-950 transition-colors hover:bg-[#E8C600]"
                    >
                        <ShoppingCart className="h-4 w-4" strokeWidth={2.2} />
                    </button>
                </div>
            </div>
        </article>
    );
}

function formatSoldQuantity(quantity: number) {
    return new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: quantity % 1 === 0 ? 0 : 2,
    }).format(quantity);
}
