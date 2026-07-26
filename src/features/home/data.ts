export type HomeProduct = {
    id: number;
    name: string;
    slug: string;
    href: string;
    imageUrl: string | null;
    imageAlt: string;
    price: number | null;
    regularPrice: number | null;
    isPromotion: boolean;
    unit: string | null;
    salesRank: number | null;
    soldQuantity: number | null;
};

export type ProductsPage = {
    products: HomeProduct[];
    currentPage: number;
    lastPage: number;
    total: number;
};

type ApiCollection<T> = {
    data?: T[];
    meta?: {
        current_page?: number;
        last_page?: number;
        total?: number;
    };
};

type ApiProductImage = {
    url?: string | null;
    alt_text?: string | null;
    position?: number | null;
    is_primary?: boolean | null;
};

type ApiOffer = {
    regular_price?: string | number | null;
    effective_price?: string | number | null;
    is_promotion?: boolean | null;
};

type ApiSku = {
    unit?: string | null;
    best_offer?: ApiOffer | null;
};

type ApiProduct = {
    id: number;
    name: string;
    slug: string;
    images?: ApiProductImage[];
    skus?: ApiSku[];
    sales_rank?: number | null;
    sold_quantity?: string | number | null;
};

type MockProductsFile = {
    products?: HomeProduct[];
};

const catalogProductsPerPage = 12;

function getApiUrl(path: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.");
    }

    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${normalizedBaseUrl}${normalizedPath}`;
}

export async function getBestSellerProducts(): Promise<HomeProduct[]> {
    const mockProducts = await getLocalMockProducts();

    if (mockProducts) {
        return [...mockProducts]
            .sort((firstProduct, secondProduct) => {
                const firstSoldQuantity = firstProduct.soldQuantity ?? 0;
                const secondSoldQuantity = secondProduct.soldQuantity ?? 0;

                return secondSoldQuantity - firstSoldQuantity;
            })
            .slice(0, 12)
            .map((product, index) => ({
                ...product,
                salesRank: index + 1,
            }));
    }

    try {
        const response = await fetch(getApiUrl("/products/best-sellers"), {
            cache: "no-store",
            headers: {
                Accept: "application/json",
            },
        });

        if (!response.ok) {
            return [];
        }

        const payload = (await response.json()) as ApiCollection<ApiProduct>;

        return (payload.data ?? []).map(mapBestSellerProduct);
    } catch {
        return [];
    }
}

export async function getProductsPage(page: number): Promise<ProductsPage> {
    const safePage = Number.isFinite(page) && page > 0 ? Math.floor(page) : 1;
    const mockProducts = await getLocalMockProducts();

    if (mockProducts) {
        const firstProductIndex = (safePage - 1) * catalogProductsPerPage;
        const products = mockProducts.slice(
            firstProductIndex,
            firstProductIndex + catalogProductsPerPage,
        );

        return {
            products,
            currentPage: safePage,
            lastPage: Math.max(1, Math.ceil(mockProducts.length / catalogProductsPerPage)),
            total: mockProducts.length,
        };
    }

    try {
        const response = await fetch(
            getApiUrl(`/products?page=${safePage}&per_page=${catalogProductsPerPage}`),
            {
                cache: "no-store",
                headers: {
                    Accept: "application/json",
                },
            },
        );

        if (!response.ok) {
            return emptyProductsPage(safePage);
        }

        const payload = (await response.json()) as ApiCollection<ApiProduct>;

        return {
            products: (payload.data ?? []).map(mapBestSellerProduct),
            currentPage: payload.meta?.current_page ?? safePage,
            lastPage: payload.meta?.last_page ?? 1,
            total: payload.meta?.total ?? 0,
        };
    } catch {
        return emptyProductsPage(page);
    }
}

async function getLocalMockProducts(): Promise<HomeProduct[] | null> {
    if (
        process.env.NODE_ENV === "production" ||
        process.env.NEXT_PUBLIC_USE_MOCK_PRODUCTS !== "true"
    ) {
        return null;
    }

    try {
        const { readFile } = await import("node:fs/promises");
        const file = await readFile(
            `${process.cwd()}/src/features/home/mock-products.local.json`,
            "utf-8",
        );
        const payload = JSON.parse(file) as MockProductsFile;

        return Array.isArray(payload.products) ? payload.products : null;
    } catch {
        return null;
    }
}

function mapBestSellerProduct(product: ApiProduct): HomeProduct {
    const image = pickPrimaryImage(product.images ?? []);
    const skuWithBestOffer = pickSkuWithBestOffer(product.skus ?? []);
    const offer = skuWithBestOffer?.best_offer ?? null;
    const price = parseNumber(offer?.effective_price);
    const regularPrice = parseNumber(offer?.regular_price);
    const isPromotion = Boolean(
        offer?.is_promotion && regularPrice !== null && price !== null && regularPrice > price,
    );

    return {
        id: product.id,
        name: product.name,
        slug: product.slug,
        href: `/produtos/${product.slug}`,
        imageUrl: image?.url ?? null,
        imageAlt: image?.alt_text || product.name,
        price,
        regularPrice: isPromotion ? regularPrice : null,
        isPromotion,
        unit: skuWithBestOffer?.unit ?? product.skus?.[0]?.unit ?? null,
        salesRank: product.sales_rank ?? null,
        soldQuantity: parseNumber(product.sold_quantity),
    };
}

function emptyProductsPage(page: number): ProductsPage {
    return {
        products: [],
        currentPage: Number.isFinite(page) && page > 0 ? Math.floor(page) : 1,
        lastPage: 1,
        total: 0,
    };
}

function pickPrimaryImage(images: ApiProductImage[]) {
    return [...images].sort((firstImage, secondImage) => {
        if (firstImage.is_primary !== secondImage.is_primary) {
            return firstImage.is_primary ? -1 : 1;
        }

        return (firstImage.position ?? 0) - (secondImage.position ?? 0);
    })[0];
}

function pickSkuWithBestOffer(skus: ApiSku[]) {
    return [...skus]
        .filter((sku) => sku.best_offer?.effective_price !== undefined)
        .sort((firstSku, secondSku) => {
            const firstPrice = parseNumber(firstSku.best_offer?.effective_price) ?? Infinity;
            const secondPrice = parseNumber(secondSku.best_offer?.effective_price) ?? Infinity;

            return firstPrice - secondPrice;
        })[0];
}

function parseNumber(value: string | number | null | undefined) {
    if (value === null || value === undefined) {
        return null;
    }

    const parsedValue = Number(value);

    return Number.isFinite(parsedValue) ? parsedValue : null;
}
