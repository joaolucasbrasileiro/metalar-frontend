export type ProductDetailImage = {
    url: string;
    altText: string;
    isPrimary: boolean;
    position: number;
};

export type ProductDetailOffer = {
    key: string;
    shopId: number;
    shopCode: string;
    shopName: string;
    regularPrice: number;
    effectivePrice: number;
    isPromotion: boolean;
    promotionId: number | null;
    availableQuantity: number;
    totalShopStock: number;
};

export type ProductDetailSku = {
    id: number;
    sku: string;
    barcode: string | null;
    variantName: string | null;
    unit: string;
    totalAvailable: number;
    dimensions: {
        length: number | null;
        width: number | null;
        height: number | null;
    };
    bestOffer: ProductDetailOffer | null;
    offers: ProductDetailOffer[];
};

export type ProductDetailSubcategory = {
    id: number;
    name: string;
    slug: string;
    category?: {
        id: number;
        name: string;
        slug: string;
    } | null;
};

export type ProductDetail = {
    id: number;
    name: string;
    slug: string;
    description: string | null;
    specifications: Record<string, string>;
    brandName: string | null;
    images: ProductDetailImage[];
    skus: ProductDetailSku[];
    subcategories: ProductDetailSubcategory[];
};

type ApiProductImage = {
    url?: string | null;
    alt_text?: string | null;
    is_primary?: boolean | null;
    position?: number | null;
};

type ApiProductOffer = {
    shop?: {
        id?: number;
        code?: string;
        name?: string;
    } | null;
    regular_price?: string | number | null;
    effective_price?: string | number | null;
    is_promotion?: boolean | null;
    promotion_id?: number | null;
    available_quantity?: string | number | null;
    total_shop_stock?: string | number | null;
};

type ApiProductSku = {
    id?: number;
    sku?: string;
    barcode?: string | null;
    variant_name?: string | null;
    unit?: string | null;
    total_available?: string | number | null;
    dimensions?: {
        length?: string | number | null;
        width?: string | number | null;
        height?: string | number | null;
    } | null;
    best_offer?: ApiProductOffer | null;
    offers?: ApiProductOffer[];
};

type ApiProductSubcategory = {
    id?: number;
    name?: string;
    slug?: string;
    category?: {
        id?: number;
        name?: string;
        slug?: string;
    } | null;
};

type ApiProduct = {
    id?: number;
    name?: string;
    slug?: string;
    description?: string | null;
    specifications?: Record<string, unknown> | null;
    brand?: {
        name?: string | null;
    } | null;
    images?: ApiProductImage[];
    skus?: ApiProductSku[];
    subcategories?: ApiProductSubcategory[];
};

type ApiProductPayload = {
    data?: ApiProduct;
};

function getApiUrl(path: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.");
    }

    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${normalizedBaseUrl}${normalizedPath}`;
}

export async function getProductDetail(slug: string): Promise<ProductDetail | null> {
    const response = await fetch(getApiUrl(`/products/${encodeURIComponent(slug)}`), {
        cache: "no-store",
        headers: {
            Accept: "application/json",
        },
    });

    if (response.status === 404) {
        return null;
    }

    if (!response.ok) {
        throw new Error("Nao foi possivel carregar o produto.");
    }

    const payload = (await response.json()) as ApiProductPayload;

    if (!payload.data?.id || !payload.data.name || !payload.data.slug) {
        return null;
    }

    return mapProduct(payload.data);
}

function mapProduct(product: ApiProduct): ProductDetail {
    return {
        id: Number(product.id),
        name: String(product.name),
        slug: String(product.slug),
        description: product.description ?? null,
        specifications: mapSpecifications(product.specifications ?? {}),
        brandName: product.brand?.name ?? null,
        images: (product.images ?? [])
            .map((image, index) => ({
                url: image.url ?? "",
                altText: image.alt_text || String(product.name),
                isPrimary: Boolean(image.is_primary),
                position: image.position ?? index,
            }))
            .filter((image) => image.url)
            .sort((first, second) => {
                if (first.isPrimary !== second.isPrimary) {
                    return first.isPrimary ? -1 : 1;
                }

                return first.position - second.position;
            }),
        skus: (product.skus ?? [])
            .map(mapSku)
            .filter((sku): sku is ProductDetailSku => sku !== null),
        subcategories: (product.subcategories ?? [])
            .map((subcategory) => ({
                id: Number(subcategory.id),
                name: subcategory.name ?? "Subcategoria",
                slug: subcategory.slug ?? "",
                category: subcategory.category?.id ? {
                    id: Number(subcategory.category.id),
                    name: subcategory.category.name ?? "Categoria",
                    slug: subcategory.category.slug ?? "",
                } : null,
            }))
            .filter((subcategory) => Number.isFinite(subcategory.id)),
    };
}

function mapSku(sku: ApiProductSku): ProductDetailSku | null {
    if (!sku.id || !sku.sku) {
        return null;
    }

    const offers = (sku.offers ?? [])
        .map((offer, index) => mapOffer(offer, String(sku.sku), index))
        .filter((offer): offer is ProductDetailOffer => offer !== null);

    return {
        id: Number(sku.id),
        sku: String(sku.sku),
        barcode: sku.barcode ?? null,
        variantName: sku.variant_name ?? null,
        unit: sku.unit ?? "un",
        totalAvailable: parseNumber(sku.total_available) ?? 0,
        dimensions: {
            length: parseNumber(sku.dimensions?.length),
            width: parseNumber(sku.dimensions?.width),
            height: parseNumber(sku.dimensions?.height),
        },
        bestOffer: sku.best_offer ? mapOffer(sku.best_offer, String(sku.sku), -1) : null,
        offers,
    };
}

function mapOffer(
    offer: ApiProductOffer,
    skuCode: string,
    index: number,
): ProductDetailOffer | null {
    const shopId = Number(offer.shop?.id);
    const effectivePrice = parseNumber(offer.effective_price);
    const regularPrice = parseNumber(offer.regular_price);

    if (!Number.isFinite(shopId) || effectivePrice === null || regularPrice === null) {
        return null;
    }

    const promotionId = typeof offer.promotion_id === "number" ? offer.promotion_id : null;

    return {
        key: `${skuCode}-${shopId}-${promotionId ?? "regular"}-${index}`,
        shopId,
        shopCode: offer.shop?.code ?? "",
        shopName: offer.shop?.name ?? "Loja",
        regularPrice,
        effectivePrice,
        isPromotion: Boolean(offer.is_promotion),
        promotionId,
        availableQuantity: parseNumber(offer.available_quantity) ?? 0,
        totalShopStock: parseNumber(offer.total_shop_stock) ?? 0,
    };
}

function mapSpecifications(specifications: Record<string, unknown>) {
    return Object.fromEntries(
        Object.entries(specifications)
            .map(([key, value]) => [key, String(value ?? "").trim()])
            .filter(([key, value]) => key.trim() && value),
    );
}

function parseNumber(value: string | number | null | undefined) {
    if (value === null || value === undefined) {
        return null;
    }

    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) ? parsedValue : null;
}
