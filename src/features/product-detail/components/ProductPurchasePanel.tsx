"use client";

import { CheckCircle2, Minus, Plus, RefreshCcw, ShoppingCart, Store } from "lucide-react";
import { useRouter } from "next/navigation";
import * as React from "react";

import type { ProductDetail, ProductDetailOffer } from "../data";

type ProductPurchasePanelProps = {
    product: ProductDetail;
};

const currencyFormatter = new Intl.NumberFormat("pt-BR", {
    style: "currency",
    currency: "BRL",
});

export function ProductPurchasePanel({ product }: ProductPurchasePanelProps) {
    const router = useRouter();
    const firstPurchasableSku = product.skus.find((sku) => sku.offers.length > 0) ?? product.skus[0];
    const [selectedSkuId, setSelectedSkuId] = React.useState(firstPurchasableSku?.id ?? 0);
    const selectedSku = product.skus.find((sku) => sku.id === selectedSkuId) ?? firstPurchasableSku;
    const [selectedOfferKey, setSelectedOfferKey] = React.useState(
        selectedSku?.bestOffer?.key ?? selectedSku?.offers[0]?.key ?? "",
    );
    const selectedOffer = selectedSku?.offers.find((offer) => offer.key === selectedOfferKey)
        ?? selectedSku?.bestOffer
        ?? selectedSku?.offers[0]
        ?? null;
    const [quantity, setQuantity] = React.useState(1);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const hasOffer = Boolean(selectedSku && selectedOffer);
    const maxQuantity = selectedOffer?.availableQuantity ?? selectedSku?.totalAvailable ?? 0;
    const unitLabel = selectedSku ? unitLabelFor(selectedSku.unit) : "unidade";
    const installmentPrice = selectedOffer ? selectedOffer.effectivePrice / 10 : null;

    function selectSku(skuId: number) {
        const nextSku = product.skus.find((sku) => sku.id === skuId);
        const nextOffer = nextSku?.bestOffer ?? nextSku?.offers[0] ?? null;

        setSelectedSkuId(skuId);
        setSelectedOfferKey(nextOffer?.key ?? "");
        setQuantity(1);
    }

    async function submitCart() {
        if (!selectedSku || !selectedOffer) {
            return;
        }

        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch("/api/cart/items", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_sku_id: selectedSku.id,
                    shop_id: selectedOffer.shopId,
                    promotion_id: selectedOffer.promotionId,
                    quantity,
                }),
            });
            const payload = await response.json();

            if (response.status === 401) {
                router.push(`/signin?redirect=/produtos/${product.slug}`);
                return;
            }

            if (!response.ok) {
                throw new Error(responseMessage(payload));
            }

            setMessage("Produto adicionado ao carrinho.");
        } catch (caughtError) {
            setError(caughtError instanceof Error ? caughtError.message : "Nao foi possivel adicionar ao carrinho.");
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <aside className="grid gap-5 rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm lg:sticky lg:top-5">
            <div>
                <p className="text-xs font-black uppercase text-zinc-500">Comprar</p>
                <h2 className="mt-1 text-lg font-black text-zinc-950">Escolha a variedade</h2>
            </div>

            <div className="grid gap-2">
                {product.skus.length === 0 ? (
                    <div className="rounded-[6px] border border-zinc-200 bg-zinc-50 p-3 text-sm font-bold text-zinc-500">
                        Nenhum SKU disponivel para venda.
                    </div>
                ) : (
                    product.skus.map((sku) => (
                        <button
                            key={sku.id}
                            type="button"
                            onClick={() => selectSku(sku.id)}
                            className={`grid gap-1 rounded-[6px] border p-3 text-left transition-colors ${
                                selectedSku?.id === sku.id
                                    ? "border-zinc-950 bg-zinc-950 text-white"
                                    : "border-zinc-200 bg-white text-zinc-950 hover:border-zinc-400"
                            }`}
                        >
                            <span className="text-sm font-black">
                                {sku.variantName || sku.sku}
                            </span>
                            <span className={`text-xs font-bold ${
                                selectedSku?.id === sku.id ? "text-zinc-300" : "text-zinc-500"
                            }`}>
                                SKU {sku.sku} | {unitLabelFor(sku.unit)} | estoque {formatQuantity(sku.totalAvailable)}
                            </span>
                        </button>
                    ))
                )}
            </div>

            {selectedSku && (
                <div className="grid gap-3 border-t border-zinc-100 pt-4">
                    <p className="text-xs font-black uppercase text-zinc-500">Loja e oferta</p>
                    {selectedSku.offers.length === 0 ? (
                        <div className="rounded-[6px] border border-amber-200 bg-amber-50 p-3 text-sm font-bold text-amber-900">
                            Este SKU ainda nao possui preco e estoque disponiveis para venda.
                        </div>
                    ) : (
                        selectedSku.offers.map((offer) => (
                            <OfferButton
                                key={offer.key}
                                offer={offer}
                                active={selectedOffer?.key === offer.key}
                                onClick={() => setSelectedOfferKey(offer.key)}
                            />
                        ))
                    )}
                </div>
            )}

            <div className="grid gap-2 border-t border-zinc-100 pt-4">
                {selectedOffer ? (
                    <>
                        {selectedOffer.isPromotion && selectedOffer.regularPrice > selectedOffer.effectivePrice && (
                            <p className="text-sm font-bold text-zinc-400">
                                De: <span className="line-through">{currencyFormatter.format(selectedOffer.regularPrice)}</span>
                            </p>
                        )}
                        <p className="text-3xl font-black text-zinc-950">
                            {currencyFormatter.format(selectedOffer.effectivePrice)}
                            <span className="ml-2 text-sm font-extrabold text-zinc-500">/ {unitLabel}</span>
                        </p>
                        <p className="text-sm font-semibold text-zinc-600">
                            A vista no PIX ou boleto
                            {installmentPrice && (
                                <span className="block">
                                    ate 10x de {currencyFormatter.format(installmentPrice)} no cartao
                                </span>
                            )}
                        </p>
                    </>
                ) : (
                    <p className="text-2xl font-black text-zinc-950">Consultar</p>
                )}
            </div>

            <div className="grid gap-3">
                <div className="grid grid-cols-[44px_1fr_44px] gap-2">
                    <button
                        type="button"
                        onClick={() => setQuantity((current) => Math.max(1, current - 1))}
                        className="grid h-11 place-items-center rounded-[6px] border border-zinc-300 bg-white text-zinc-950 transition-colors hover:bg-zinc-50"
                        aria-label="Diminuir quantidade"
                    >
                        <Minus className="h-4 w-4" />
                    </button>
                    <input
                        value={quantity}
                        onChange={(event) => {
                            const nextValue = Number(event.target.value);
                            setQuantity(Number.isFinite(nextValue) && nextValue > 0 ? nextValue : 1);
                        }}
                        min="1"
                        max={maxQuantity > 0 ? maxQuantity : undefined}
                        step="1"
                        type="number"
                        className="h-11 rounded-[6px] border border-zinc-300 bg-white px-3 text-center text-sm font-black text-zinc-950 outline-none focus:border-zinc-950"
                    />
                    <button
                        type="button"
                        onClick={() => setQuantity((current) => (
                            maxQuantity > 0 ? Math.min(maxQuantity, current + 1) : current + 1
                        ))}
                        className="grid h-11 place-items-center rounded-[6px] border border-zinc-300 bg-white text-zinc-950 transition-colors hover:bg-zinc-50"
                        aria-label="Aumentar quantidade"
                    >
                        <Plus className="h-4 w-4" />
                    </button>
                </div>

                <button
                    type="button"
                    onClick={submitCart}
                    disabled={!hasOffer || isSubmitting}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-[6px] bg-[#FFD900] px-5 text-base font-black text-zinc-950 transition-colors hover:bg-[#f2ce00] disabled:cursor-not-allowed disabled:bg-zinc-200 disabled:text-zinc-500"
                >
                    {isSubmitting ? (
                        <RefreshCcw className="h-5 w-5 animate-spin" />
                    ) : (
                        <ShoppingCart className="h-5 w-5" />
                    )}
                    Adicionar ao carrinho
                </button>
            </div>

            {message && (
                <div className="flex items-center gap-2 rounded-[6px] border border-emerald-200 bg-emerald-50 p-3 text-sm font-bold text-emerald-900">
                    <CheckCircle2 className="h-4 w-4" />
                    {message}
                </div>
            )}
            {error && (
                <div className="rounded-[6px] border border-red-200 bg-red-50 p-3 text-sm font-bold text-red-900">
                    {error}
                </div>
            )}
        </aside>
    );
}

function OfferButton({
    offer,
    active,
    onClick,
}: {
    offer: ProductDetailOffer;
    active: boolean;
    onClick: () => void;
}) {
    return (
        <button
            type="button"
            onClick={onClick}
            className={`grid gap-1 rounded-[6px] border p-3 text-left transition-colors ${
                active
                    ? "border-[#FFD900] bg-[#fff9d6]"
                    : "border-zinc-200 bg-white hover:border-zinc-400"
            }`}
        >
            <span className="flex items-center gap-2 text-sm font-black text-zinc-950">
                <Store className="h-4 w-4" />
                {offer.shopName}
            </span>
            <span className="text-xs font-bold text-zinc-500">
                {formatQuantity(offer.availableQuantity)} disponivel | {currencyFormatter.format(offer.effectivePrice)}
            </span>
        </button>
    );
}

function formatQuantity(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: value % 1 === 0 ? 0 : 3,
    }).format(value);
}

function unitLabelFor(unit: string) {
    const labels: Record<string, string> = {
        un: "unidade",
        saco: "saco",
        caixa: "caixa",
        pacote: "pacote",
        metro: "metro",
        kg: "kg",
        litro: "litro",
        barra: "barra",
        rolo: "rolo",
        par: "par",
        m2: "m2",
        m3: "m3",
    };

    return labels[unit] ?? unit;
}

function responseMessage(payload: unknown) {
    if (!payload || typeof payload !== "object") {
        return "Nao foi possivel adicionar ao carrinho.";
    }

    const data = payload as { message?: string; errors?: Record<string, string[]> };
    const firstError = data.errors
        ? Object.values(data.errors).flat().find(Boolean)
        : null;

    return firstError ?? data.message ?? "Nao foi possivel adicionar ao carrinho.";
}
