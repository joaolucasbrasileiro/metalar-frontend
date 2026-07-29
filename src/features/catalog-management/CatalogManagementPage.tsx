"use client";

import {
    AlertTriangle,
    ArrowLeft,
    Boxes,
    CheckCircle2,
    Layers3,
    LogOut,
    PackagePlus,
    Plus,
    RefreshCcw,
    Save,
    Search,
    Tag,
    Trash2,
    Upload,
    Warehouse,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import * as React from "react";

type AccountUser = {
    name: string;
    role?: string | null;
};

type BrandOption = {
    id: number;
    name: string;
};

type SubcategoryOption = {
    id: number;
    name: string;
    children?: SubcategoryOption[];
};

type CategoryOption = {
    id: number;
    name: string;
    description?: string | null;
    subcategories?: SubcategoryOption[];
};

type ShopOption = {
    id: number;
    code: string;
    name: string;
};

type ProductOption = {
    id: number;
    name: string;
    slug: string;
    brand?: {
        name?: string | null;
    } | null;
};

type OptionsPayload = {
    brands?: BrandOption[];
    categories?: CategoryOption[];
    shops?: ShopOption[];
    message?: string;
};

type ProductPayload = {
    data?: ProductOption;
    message?: string;
    errors?: Record<string, string[]>;
};

type CreatedSku = {
    id: number;
    sku: string;
    variant_name?: string | null;
    unit: string;
};

type SkuPayload = {
    data?: CreatedSku;
    message?: string;
    errors?: Record<string, string[]>;
};

type SpecRow = {
    id: string;
    label: string;
    value: string;
};

type SkuDraft = {
    id: string;
    variant_name: string;
    sku: string;
    barcode: string;
    unit: string;
    weight: string;
    length: string;
    width: string;
    height: string;
};

type StockDraft = {
    quantity: string;
    reason: string;
};

type ViewMode = "overview" | "product" | "sku" | "categories";

const emptySku = (): SkuDraft => ({
    id: crypto.randomUUID(),
    variant_name: "",
    sku: "",
    barcode: "",
    unit: "un",
    weight: "",
    length: "",
    width: "",
    height: "",
});

const initialSpecs = (): SpecRow[] => [
    { id: crypto.randomUUID(), label: "Material", value: "" },
    { id: crypto.randomUUID(), label: "Aplicacao", value: "" },
    { id: crypto.randomUUID(), label: "Garantia", value: "" },
];

function isCatalogManager(role?: string | null) {
    return role === "moderator" || role === "admin";
}

export function CatalogManagementPage() {
    const router = useRouter();
    const [user, setUser] = React.useState<AccountUser | null>(null);
    const [brands, setBrands] = React.useState<BrandOption[]>([]);
    const [categories, setCategories] = React.useState<CategoryOption[]>([]);
    const [shops, setShops] = React.useState<ShopOption[]>([]);
    const [mode, setMode] = React.useState<ViewMode>("overview");
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSearchingProducts, setIsSearchingProducts] = React.useState(false);
    const [isRestocking, setIsRestocking] = React.useState(false);
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);

    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [brandId, setBrandId] = React.useState("");
    const [currentCategoryId, setCurrentCategoryId] = React.useState("");
    const [currentSubcategoryId, setCurrentSubcategoryId] = React.useState("");
    const [selectedSubcategories, setSelectedSubcategories] = React.useState<number[]>([]);
    const [specRows, setSpecRows] = React.useState<SpecRow[]>(initialSpecs);
    const [images, setImages] = React.useState<File[]>([]);
    const [createdProduct, setCreatedProduct] = React.useState<ProductOption | null>(null);

    const [selectedShopCode, setSelectedShopCode] = React.useState("");
    const [productSearch, setProductSearch] = React.useState("");
    const [products, setProducts] = React.useState<ProductOption[]>([]);
    const [selectedProductId, setSelectedProductId] = React.useState("");
    const [skuDraft, setSkuDraft] = React.useState<SkuDraft>(emptySku());
    const [skuPrice, setSkuPrice] = React.useState("");
    const [createdSku, setCreatedSku] = React.useState<CreatedSku | null>(null);
    const [stockDraft, setStockDraft] = React.useState<StockDraft>({
        quantity: "",
        reason: "Estoque inicial",
    });
    const [categoryName, setCategoryName] = React.useState("");
    const [categoryDescription, setCategoryDescription] = React.useState("");
    const [subcategoryCategoryId, setSubcategoryCategoryId] = React.useState("");
    const [subcategoryParentId, setSubcategoryParentId] = React.useState("");
    const [subcategoryName, setSubcategoryName] = React.useState("");
    const [subcategoryDescription, setSubcategoryDescription] = React.useState("");

    React.useEffect(() => {
        let isMounted = true;

        async function loadManagementData() {
            try {
                const [meResponse, optionsResponse] = await Promise.all([
                    fetch("/api/auth/me", { cache: "no-store" }),
                    fetch("/api/catalog-management/options", { cache: "no-store" }),
                ]);

                if (meResponse.status === 401 || optionsResponse.status === 401) {
                    router.replace("/signin");
                    return;
                }

                const mePayload = (await meResponse.json()) as { data?: AccountUser };

                if (!meResponse.ok || !isCatalogManager(mePayload.data?.role)) {
                    router.replace("/account");
                    return;
                }

                const optionsPayload = (await optionsResponse.json()) as OptionsPayload;

                if (!optionsResponse.ok) {
                    throw new Error(optionsPayload.message ?? "Falha ao carregar catalogo.");
                }

                if (isMounted) {
                    setUser(mePayload.data ?? null);
                    setBrands(optionsPayload.brands ?? []);
                    setCategories(optionsPayload.categories ?? []);
                    setShops(optionsPayload.shops ?? []);
                    setSelectedShopCode(optionsPayload.shops?.[0]?.code ?? "");
                    setSubcategoryCategoryId(optionsPayload.categories?.[0]
                        ? String(optionsPayload.categories[0].id)
                        : "");
                }
            } catch (caughtError) {
                if (isMounted) {
                    setError(errorMessage(caughtError));
                }
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadManagementData();

        return () => {
            isMounted = false;
        };
    }, [router]);

    function resetProductForm() {
        setName("");
        setDescription("");
        setBrandId("");
        setCurrentCategoryId("");
        setCurrentSubcategoryId("");
        setSelectedSubcategories([]);
        setSpecRows(initialSpecs());
        setImages([]);
        setCreatedProduct(null);
        setMessage(null);
        setError(null);
    }

    function resetSkuForm() {
        setProductSearch("");
        setProducts([]);
        setSelectedProductId("");
        setSkuDraft(emptySku());
        setSkuPrice("");
        setCreatedSku(null);
        setStockDraft({
            quantity: "",
            reason: "Estoque inicial",
        });
        setMessage(null);
        setError(null);
    }

    function resetCategoryForm() {
        setCategoryName("");
        setCategoryDescription("");
        setSubcategoryCategoryId(categories[0] ? String(categories[0].id) : "");
        setSubcategoryParentId("");
        setSubcategoryName("");
        setSubcategoryDescription("");
        setMessage(null);
        setError(null);
    }

    function addSelectedSubcategory() {
        const subcategoryId = Number(currentSubcategoryId);

        if (!subcategoryId || selectedSubcategories.includes(subcategoryId)) {
            return;
        }

        setSelectedSubcategories((current) => [...current, subcategoryId]);
        setCurrentSubcategoryId("");
    }

    function removeSelectedSubcategory(subcategoryId: number) {
        setSelectedSubcategories((current) => current.filter((id) => id !== subcategoryId));
    }

    function updateSpec(rowId: string, field: "label" | "value", value: string) {
        setSpecRows((current) => current.map((row) => (
            row.id === rowId ? { ...row, [field]: value } : row
        )));
    }

    function updateSku(field: keyof SkuDraft, value: string) {
        setSkuDraft((current) => ({ ...current, [field]: value }));
    }

    async function searchProducts() {
        setIsSearchingProducts(true);
        setError(null);

        try {
            const params = new URLSearchParams();

            if (productSearch.trim()) {
                params.set("search", productSearch.trim());
            }

            const response = await fetch(`/api/catalog-management/products?${params}`, {
                cache: "no-store",
            });
            const payload = (await response.json()) as { data?: ProductOption[]; message?: string };

            if (!response.ok) {
                throw new Error(payload.message ?? "Nao foi possivel buscar produtos.");
            }

            setProducts(payload.data ?? []);
        } catch (caughtError) {
            setError(errorMessage(caughtError));
        } finally {
            setIsSearchingProducts(false);
        }
    }

    async function submitProduct(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            if (selectedSubcategories.length === 0) {
                throw new Error("Selecione pelo menos uma categoria e subcategoria do catalogo.");
            }

            const productResponse = await fetch("/api/catalog-management/products", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    brand_id: brandId ? Number(brandId) : null,
                    subcategory_ids: selectedSubcategories,
                    name,
                    description,
                    specifications: specificationsPayload(specRows),
                }),
            });
            const productPayload = (await productResponse.json()) as ProductPayload;

            if (!productResponse.ok || !productPayload.data) {
                throw new Error(responseMessage(productPayload));
            }

            for (const [index, image] of images.entries()) {
                const formData = new FormData();
                formData.append("product_id", String(productPayload.data.id));
                formData.append("image", image);
                formData.append("alt_text", name);
                formData.append("position", String(index));
                formData.append("is_primary", index === 0 ? "1" : "0");

                const imageResponse = await fetch("/api/catalog-management/product-images", {
                    method: "POST",
                    body: formData,
                });

                if (!imageResponse.ok) {
                    const payload = await imageResponse.json();
                    throw new Error(responseMessage(payload));
                }
            }

            setCreatedProduct(productPayload.data);
            setProducts((current) => [productPayload.data!, ...current]);
            setSelectedProductId(String(productPayload.data.id));
            setMessage("Produto cadastrado. Use Adicionar SKU para escolher loja, preco e estoque.");
        } catch (caughtError) {
            setError(errorMessage(caughtError));
        } finally {
            setIsSubmitting(false);
        }
    }

    async function submitSku(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            if (!selectedShopCode) {
                throw new Error("Selecione a loja em que esse SKU sera vendido.");
            }

            if (!selectedProductId) {
                throw new Error("Pesquise e selecione um produto existente.");
            }

            const skuResponse = await fetch("/api/catalog-management/product-skus", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    product_id: Number(selectedProductId),
                    ...skuNumberPayload(skuDraft),
                }),
            });
            const skuPayload = (await skuResponse.json()) as SkuPayload;

            if (!skuResponse.ok || !skuPayload.data) {
                throw new Error(responseMessage(skuPayload));
            }

            const priceResponse = await fetch("/api/catalog-management/prices", {
                method: "PUT",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    shop_code: selectedShopCode,
                    sku: skuPayload.data.sku,
                    price: skuPrice,
                }),
            });
            const pricePayload = await priceResponse.json();

            if (!priceResponse.ok) {
                throw new Error(responseMessage(pricePayload));
            }

            setCreatedSku(skuPayload.data);
            setMessage("SKU criado e preco aplicado na loja selecionada.");
        } catch (caughtError) {
            setError(errorMessage(caughtError));
        } finally {
            setIsSubmitting(false);
        }
    }

    async function submitStock(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsRestocking(true);
        setError(null);
        setMessage(null);

        try {
            if (!createdSku) {
                throw new Error("Crie o SKU e aplique o preco antes de registrar estoque.");
            }

            const response = await fetch("/api/catalog-management/stock-adjustments", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    shop_code: selectedShopCode,
                    sku: createdSku.sku,
                    quantity: stockDraft.quantity,
                    reason: stockDraft.reason,
                }),
            });
            const payload = await response.json();

            if (!response.ok) {
                throw new Error(responseMessage(payload));
            }

            setMessage("Reestoque registrado com sucesso.");
            setCreatedSku(null);
            setSkuDraft(emptySku());
            setSkuPrice("");
            setStockDraft({
                quantity: "",
                reason: "Estoque inicial",
            });
        } catch (caughtError) {
            setError(errorMessage(caughtError));
        } finally {
            setIsRestocking(false);
        }
    }

    async function submitCategory(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch("/api/catalog-management/categories", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: categoryName,
                    description: categoryDescription,
                }),
            });
            const payload = (await response.json()) as {
                data?: CategoryOption;
                message?: string;
                errors?: Record<string, string[]>;
            };

            if (!response.ok || !payload.data) {
                throw new Error(responseMessage(payload));
            }

            setCategories((current) => [...current, payload.data!].sort(byName));
            setCategoryName("");
            setCategoryDescription("");
            setSubcategoryCategoryId(String(payload.data.id));
            setMessage("Categoria criada com sucesso.");
        } catch (caughtError) {
            setError(errorMessage(caughtError));
        } finally {
            setIsSubmitting(false);
        }
    }

    async function submitSubcategory(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
            const response = await fetch("/api/catalog-management/subcategories", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    category_id: Number(subcategoryCategoryId),
                    parent_id: subcategoryParentId ? Number(subcategoryParentId) : null,
                    name: subcategoryName,
                    description: subcategoryDescription,
                }),
            });
            const payload = (await response.json()) as {
                data?: SubcategoryOption & { category?: CategoryOption };
                message?: string;
                errors?: Record<string, string[]>;
            };

            if (!response.ok || !payload.data) {
                throw new Error(responseMessage(payload));
            }

            setCategories((current) => addSubcategoryToCategories(
                current,
                Number(subcategoryCategoryId),
                subcategoryParentId ? Number(subcategoryParentId) : null,
                payload.data!,
            ));
            setSubcategoryParentId("");
            setSubcategoryName("");
            setSubcategoryDescription("");
            setMessage("Subcategoria criada com sucesso.");
        } catch (caughtError) {
            setError(errorMessage(caughtError));
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isLoading) {
        return (
            <main className="grid min-h-screen place-items-center bg-[#eef1f5] px-6 text-zinc-950">
                <div className="h-10 w-10 animate-spin rounded-full border-4 border-zinc-300 border-t-[#FFD900]" />
            </main>
        );
    }

    return (
        <main className="min-h-screen bg-[#eef1f5] text-zinc-950">
            <div className="grid min-h-screen lg:grid-cols-[260px_1fr]">
                <aside className="border-b border-zinc-200 bg-zinc-950 px-5 py-5 text-white lg:border-b-0 lg:border-r lg:border-zinc-800">
                    <div className="flex items-center gap-3">
                        <span className="grid h-10 w-10 place-items-center rounded-[6px] bg-[#FFD900] text-zinc-950">
                            <Boxes className="h-5 w-5" />
                        </span>
                        <div>
                            <p className="text-sm font-black">Metalar</p>
                            <p className="text-xs font-semibold text-zinc-400">
                                Gestao de catalogo
                            </p>
                        </div>
                    </div>

                    <nav className="mt-8 grid gap-2">
                        <NavButton
                            active={mode === "overview"}
                            icon={Layers3}
                            label="Visao geral"
                            onClick={() => setMode("overview")}
                        />
                        <NavButton
                            active={mode === "product"}
                            icon={PackagePlus}
                            label="Adicionar produto"
                            onClick={() => {
                                resetProductForm();
                                setMode("product");
                            }}
                        />
                        <NavButton
                            active={mode === "sku"}
                            icon={Tag}
                            label="Adicionar SKU"
                            onClick={() => {
                                resetSkuForm();
                                setMode("sku");
                            }}
                        />
                        <NavButton
                            active={mode === "categories"}
                            icon={Layers3}
                            label="Categorias"
                            onClick={() => {
                                resetCategoryForm();
                                setMode("categories");
                            }}
                        />
                    </nav>

                    <div className="mt-8 rounded-[8px] border border-zinc-800 bg-zinc-900 p-4">
                        <p className="text-xs font-semibold uppercase text-zinc-500">Operador</p>
                        <p className="mt-1 truncate text-sm font-extrabold">{user?.name}</p>
                        <p className="text-xs font-semibold text-[#FFD900]">
                            {user?.role === "admin" ? "Administrador" : "Moderador"}
                        </p>
                    </div>

                    <Link
                        href="/account"
                        className="mt-4 flex h-10 items-center gap-2 rounded-[6px] px-3 text-sm font-bold text-zinc-300 transition-colors hover:bg-zinc-900 hover:text-white"
                    >
                        <LogOut className="h-4 w-4" />
                        Voltar para conta
                    </Link>
                </aside>

                <section className="min-w-0 px-4 py-5 sm:px-6 lg:px-8">
                    <div className="mx-auto grid max-w-[1280px] gap-5">
                        <header className="flex flex-col gap-4 border-b border-zinc-200 pb-5 sm:flex-row sm:items-center sm:justify-between">
                            <div>
                                <p className="text-xs font-black uppercase text-zinc-500">
                                    Catalogo interno
                                </p>
                                <h1 className="mt-1 text-2xl font-black tracking-normal text-zinc-950">
                                    Produtos e SKUs por loja
                                </h1>
                            </div>

                            {mode === "overview" ? (
                                <div className="flex flex-wrap gap-2">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetCategoryForm();
                                            setMode("categories");
                                        }}
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border border-zinc-300 bg-white px-4 text-sm font-extrabold transition-colors hover:bg-zinc-50"
                                    >
                                        <Layers3 className="h-4 w-4" />
                                        Categorias
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetProductForm();
                                            setMode("product");
                                        }}
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border border-zinc-300 bg-white px-4 text-sm font-extrabold transition-colors hover:bg-zinc-50"
                                    >
                                        <PackagePlus className="h-4 w-4" />
                                        Produto
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => {
                                            resetSkuForm();
                                            setMode("sku");
                                        }}
                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-zinc-950 px-4 text-sm font-extrabold text-white transition-colors hover:bg-zinc-800"
                                    >
                                        <Tag className="h-4 w-4" />
                                        SKU
                                    </button>
                                </div>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => setMode("overview")}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border border-zinc-300 bg-white px-4 text-sm font-extrabold transition-colors hover:bg-zinc-50"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Voltar
                                </button>
                            )}
                        </header>

                        {error && <Notice tone="error" message={error} />}
                        {message && <Notice tone="success" message={message} />}

                        {mode === "overview" && (
                            <Overview
                                brandsCount={brands.length}
                                categoriesCount={categories.length}
                                shopsCount={shops.length}
                                onCreateProduct={() => {
                                    resetProductForm();
                                    setMode("product");
                                }}
                                onCreateSku={() => {
                                    resetSkuForm();
                                    setMode("sku");
                                }}
                                onCreateCategory={() => {
                                    resetCategoryForm();
                                    setMode("categories");
                                }}
                            />
                        )}

                        {mode === "categories" && (
                            <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                                <div className="grid gap-5">
                                    <form onSubmit={submitCategory} className="grid gap-5">
                                        <Panel icon={Layers3} title="Nova categoria" action="Principal">
                                            <Field label="Nome da categoria">
                                                <input
                                                    value={categoryName}
                                                    onChange={(event) => setCategoryName(event.target.value)}
                                                    required
                                                    minLength={2}
                                                    className={inputClass}
                                                    placeholder="Ex.: Materiais de construcao"
                                                />
                                            </Field>
                                            <Field label="Descricao">
                                                <textarea
                                                    value={categoryDescription}
                                                    onChange={(event) => setCategoryDescription(event.target.value)}
                                                    className={`${inputClass} min-h-[96px] resize-y py-3`}
                                                    placeholder="Descricao opcional para organizacao interna"
                                                />
                                            </Field>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting}
                                                className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-[6px] bg-zinc-950 px-5 text-sm font-extrabold text-white transition-colors hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-70"
                                            >
                                                {isSubmitting ? (
                                                    <RefreshCcw className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4" />
                                                )}
                                                Criar categoria
                                            </button>
                                        </Panel>
                                    </form>

                                    <form onSubmit={submitSubcategory} className="grid gap-5">
                                        <Panel icon={Layers3} title="Nova subcategoria" action="Subcategoria">
                                            <div className="grid gap-4 md:grid-cols-2">
                                                <Field label="Categoria">
                                                    <select
                                                        value={subcategoryCategoryId}
                                                        onChange={(event) => {
                                                            setSubcategoryCategoryId(event.target.value);
                                                            setSubcategoryParentId("");
                                                        }}
                                                        required
                                                        className={inputClass}
                                                    >
                                                        <option value="">Selecione</option>
                                                        {categories.map((category) => (
                                                            <option key={category.id} value={category.id}>
                                                                {category.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Field>
                                                <Field label="Subcategoria pai">
                                                    <select
                                                        value={subcategoryParentId}
                                                        onChange={(event) => setSubcategoryParentId(event.target.value)}
                                                        disabled={!subcategoryCategoryId}
                                                        className={inputClass}
                                                    >
                                                        <option value="">Nenhuma</option>
                                                        {rootSubcategoriesForCategory(
                                                            categories,
                                                            subcategoryCategoryId,
                                                        ).map((subcategory) => (
                                                            <option key={subcategory.id} value={subcategory.id}>
                                                                {subcategory.name}
                                                            </option>
                                                        ))}
                                                    </select>
                                                </Field>
                                            </div>
                                            <Field label="Nome da subcategoria">
                                                <input
                                                    value={subcategoryName}
                                                    onChange={(event) => setSubcategoryName(event.target.value)}
                                                    required
                                                    minLength={2}
                                                    className={inputClass}
                                                    placeholder="Ex.: Cimentos"
                                                />
                                            </Field>
                                            <Field label="Descricao">
                                                <textarea
                                                    value={subcategoryDescription}
                                                    onChange={(event) => setSubcategoryDescription(event.target.value)}
                                                    className={`${inputClass} min-h-[96px] resize-y py-3`}
                                                    placeholder="Descricao opcional"
                                                />
                                            </Field>
                                            <button
                                                type="submit"
                                                disabled={isSubmitting || categories.length === 0}
                                                className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-[6px] bg-zinc-950 px-5 text-sm font-extrabold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-60"
                                            >
                                                {isSubmitting ? (
                                                    <RefreshCcw className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Save className="h-4 w-4" />
                                                )}
                                                Criar subcategoria
                                            </button>
                                        </Panel>
                                    </form>
                                </div>

                                <aside className="grid h-fit gap-5 xl:sticky xl:top-5">
                                    <Panel icon={CheckCircle2} title="Resumo" action="Catalogo">
                                        <SummaryLine label="Categorias" value={`${categories.length}`} />
                                        <SummaryLine
                                            label="Subcategorias"
                                            value={`${categories.reduce(
                                                (total, category) => (
                                                    total + flattenSubcategories(category.subcategories ?? []).length
                                                ),
                                                0,
                                            )}`}
                                        />
                                    </Panel>

                                    <Panel icon={Layers3} title="Categorias atuais" action="Lista">
                                        <div className="grid max-h-[420px] gap-3 overflow-auto pr-1">
                                            {categories.length === 0 ? (
                                                <p className="text-sm font-semibold text-zinc-500">
                                                    Nenhuma categoria cadastrada.
                                                </p>
                                            ) : (
                                                categories.map((category) => (
                                                    <div
                                                        key={category.id}
                                                        className="rounded-[8px] border border-zinc-200 bg-zinc-50 p-3"
                                                    >
                                                        <p className="text-sm font-black text-zinc-950">
                                                            {category.name}
                                                        </p>
                                                        <div className="mt-2 flex flex-wrap gap-2">
                                                            {flattenSubcategories(category.subcategories ?? []).length === 0 ? (
                                                                <span className="text-xs font-bold text-zinc-500">
                                                                    Sem subcategorias
                                                                </span>
                                                            ) : (
                                                                flattenSubcategories(category.subcategories ?? []).map(
                                                                    (subcategory) => (
                                                                        <span
                                                                            key={subcategory.id}
                                                                            className="rounded-[4px] bg-white px-2 py-1 text-xs font-bold text-zinc-600"
                                                                        >
                                                                            {subcategory.name}
                                                                        </span>
                                                                    ),
                                                                )
                                                            )}
                                                        </div>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                    </Panel>
                                </aside>
                            </div>
                        )}

                        {mode === "product" && (
                            <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                                <form onSubmit={submitProduct} className="grid gap-5">
                                    <ProductFields
                                        brands={brands}
                                        categories={categories}
                                        name={name}
                                        description={description}
                                        brandId={brandId}
                                        currentCategoryId={currentCategoryId}
                                        currentSubcategoryId={currentSubcategoryId}
                                        selectedSubcategories={selectedSubcategories}
                                        specRows={specRows}
                                        images={images}
                                        onNameChange={setName}
                                        onDescriptionChange={setDescription}
                                        onBrandChange={setBrandId}
                                        onCategoryChange={(value) => {
                                            setCurrentCategoryId(value);
                                            setCurrentSubcategoryId("");
                                        }}
                                        onSubcategoryChange={setCurrentSubcategoryId}
                                        onAddSubcategory={addSelectedSubcategory}
                                        onRemoveSubcategory={removeSelectedSubcategory}
                                        onSpecChange={updateSpec}
                                        onAddSpec={() => setSpecRows((current) => [
                                            ...current,
                                            { id: crypto.randomUUID(), label: "", value: "" },
                                        ])}
                                        onRemoveSpec={(rowId) => setSpecRows((current) => (
                                            current.filter((row) => row.id !== rowId)
                                        ))}
                                        onImagesChange={setImages}
                                    />

                                    <ActionBar
                                        title="Cadastro de produto"
                                        description="Salva apenas o produto-base, fotos, categorias e ficha tecnica."
                                        isSubmitting={isSubmitting}
                                        label="Salvar produto"
                                    />
                                </form>

                                <aside className="grid h-fit gap-5 xl:sticky xl:top-5">
                                    <Panel icon={CheckCircle2} title="Resumo" action="Produto">
                                        <SummaryLine label="Produto" value={name || "Pendente"} />
                                        <SummaryLine
                                            label="Marca"
                                            value={brands.find((brand) => String(brand.id) === brandId)?.name ?? "Sem marca"}
                                        />
                                        <SummaryLine
                                            label="Categorias"
                                            value={`${selectedSubcategories.length} vinculo(s)`}
                                        />
                                        <SummaryLine label="Fotos" value={`${images.length}`} />
                                    </Panel>

                                    {createdProduct && (
                                        <Panel icon={Tag} title="Proximo passo" action="SKU">
                                            <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-3">
                                                <p className="text-sm font-black text-emerald-950">
                                                    {createdProduct.name}
                                                </p>
                                                <p className="text-xs font-bold text-emerald-700">
                                                    Produto #{createdProduct.id}
                                                </p>
                                            </div>
                                            <button
                                                type="button"
                                                onClick={() => {
                                                    resetSkuForm();
                                                    setProducts([createdProduct]);
                                                    setSelectedProductId(String(createdProduct.id));
                                                    setMode("sku");
                                                }}
                                                className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-zinc-950 px-4 text-sm font-extrabold text-white transition-colors hover:bg-zinc-800"
                                            >
                                                <Tag className="h-4 w-4" />
                                                Criar SKU desse produto
                                            </button>
                                        </Panel>
                                    )}
                                </aside>
                            </div>
                        )}

                        {mode === "sku" && (
                            <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                                <form onSubmit={submitSku} className="grid gap-5">
                                    <Panel icon={Warehouse} title="Loja e produto" action="Origem">
                                        <Field label="Loja">
                                            <select
                                                value={selectedShopCode}
                                                onChange={(event) => setSelectedShopCode(event.target.value)}
                                                required
                                                className={inputClass}
                                            >
                                                {shops.map((shop) => (
                                                    <option key={shop.id} value={shop.code}>
                                                        {shop.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>

                                        <div className="grid gap-3 md:grid-cols-[1fr_auto]">
                                            <Field label="Pesquisar produto">
                                                <input
                                                    value={productSearch}
                                                    onChange={(event) => setProductSearch(event.target.value)}
                                                    className={inputClass}
                                                    placeholder="Nome, descricao ou SKU existente"
                                                />
                                            </Field>
                                            <button
                                                type="button"
                                                onClick={searchProducts}
                                                disabled={isSearchingProducts}
                                                className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border border-zinc-300 bg-white px-4 text-sm font-extrabold transition-colors hover:bg-zinc-50 disabled:cursor-wait disabled:opacity-70 md:mt-6"
                                            >
                                                {isSearchingProducts ? (
                                                    <RefreshCcw className="h-4 w-4 animate-spin" />
                                                ) : (
                                                    <Search className="h-4 w-4" />
                                                )}
                                                Buscar
                                            </button>
                                        </div>

                                        <Field label="Produto">
                                            <select
                                                value={selectedProductId}
                                                onChange={(event) => setSelectedProductId(event.target.value)}
                                                required
                                                className={inputClass}
                                            >
                                                <option value="">Selecione um produto</option>
                                                {products.map((product) => (
                                                    <option key={product.id} value={product.id}>
                                                        {product.name}
                                                        {product.brand?.name ? ` - ${product.brand.name}` : ""}
                                                    </option>
                                                ))}
                                            </select>
                                        </Field>
                                    </Panel>

                                    <SkuFields
                                        sku={skuDraft}
                                        price={skuPrice}
                                        onSkuChange={updateSku}
                                        onPriceChange={setSkuPrice}
                                    />

                                    <ActionBar
                                        title="Cadastro de SKU"
                                        description="Cria o SKU para o produto selecionado e aplica o preco na loja escolhida."
                                        isSubmitting={isSubmitting}
                                        label="Salvar SKU e preco"
                                    />
                                </form>

                                <aside className="grid h-fit gap-5 xl:sticky xl:top-5">
                                    <Panel icon={CheckCircle2} title="Resumo" action="SKU">
                                        <SummaryLine
                                            label="Loja"
                                            value={shops.find((shop) => shop.code === selectedShopCode)?.name ?? "Pendente"}
                                        />
                                        <SummaryLine
                                            label="Produto"
                                            value={products.find((product) => String(product.id) === selectedProductId)?.name ?? "Pendente"}
                                        />
                                        <SummaryLine label="SKU" value={skuDraft.sku || "Pendente"} />
                                        <SummaryLine label="Preco" value={skuPrice ? `R$ ${skuPrice}` : "Pendente"} />
                                    </Panel>

                                    <form onSubmit={submitStock}>
                                        <Panel icon={Warehouse} title="Estoque inicial" action="Opcional">
                                            {!createdSku ? (
                                                <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
                                                    Salve o SKU com preco para liberar o estoque inicial.
                                                </div>
                                            ) : (
                                                <div className="grid gap-3">
                                                    <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-3">
                                                        <p className="text-sm font-black text-emerald-950">
                                                            {createdSku.variant_name || createdSku.sku}
                                                        </p>
                                                        <p className="text-xs font-bold text-emerald-700">
                                                            SKU {createdSku.sku}
                                                        </p>
                                                    </div>

                                                    <Field label="Quantidade">
                                                        <input
                                                            value={stockDraft.quantity}
                                                            onChange={(event) => setStockDraft((draft) => ({
                                                                ...draft,
                                                                quantity: event.target.value,
                                                            }))}
                                                            required
                                                            type="number"
                                                            step="0.001"
                                                            className={inputClass}
                                                        />
                                                    </Field>

                                                    <Field label="Motivo">
                                                        <input
                                                            value={stockDraft.reason}
                                                            onChange={(event) => setStockDraft((draft) => ({
                                                                ...draft,
                                                                reason: event.target.value,
                                                            }))}
                                                            required
                                                            minLength={3}
                                                            className={inputClass}
                                                        />
                                                    </Field>

                                                    <button
                                                        type="submit"
                                                        disabled={isRestocking}
                                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-[#FFD900] px-4 text-sm font-black text-zinc-950 transition-colors hover:bg-[#f2ce00] disabled:cursor-wait disabled:opacity-70"
                                                    >
                                                        {isRestocking ? (
                                                            <RefreshCcw className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Warehouse className="h-4 w-4" />
                                                        )}
                                                        Registrar estoque
                                                    </button>
                                                </div>
                                            )}
                                        </Panel>
                                    </form>
                                </aside>
                            </div>
                        )}
                    </div>
                </section>
            </div>
        </main>
    );
}

function NavButton({
    active,
    icon: Icon,
    label,
    onClick,
}: {
    active: boolean;
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    onClick: () => void;
}) {
    return (
        <button type="button" onClick={onClick} className={navClass(active)}>
            <Icon className="h-4 w-4" />
            {label}
        </button>
    );
}

function ProductFields({
    brands,
    categories,
    name,
    description,
    brandId,
    currentCategoryId,
    currentSubcategoryId,
    selectedSubcategories,
    specRows,
    images,
    onNameChange,
    onDescriptionChange,
    onBrandChange,
    onCategoryChange,
    onSubcategoryChange,
    onAddSubcategory,
    onRemoveSubcategory,
    onSpecChange,
    onAddSpec,
    onRemoveSpec,
    onImagesChange,
}: {
    brands: BrandOption[];
    categories: CategoryOption[];
    name: string;
    description: string;
    brandId: string;
    currentCategoryId: string;
    currentSubcategoryId: string;
    selectedSubcategories: number[];
    specRows: SpecRow[];
    images: File[];
    onNameChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
    onBrandChange: (value: string) => void;
    onCategoryChange: (value: string) => void;
    onSubcategoryChange: (value: string) => void;
    onAddSubcategory: () => void;
    onRemoveSubcategory: (subcategoryId: number) => void;
    onSpecChange: (rowId: string, field: "label" | "value", value: string) => void;
    onAddSpec: () => void;
    onRemoveSpec: (rowId: string) => void;
    onImagesChange: (files: File[]) => void;
}) {
    return (
        <>
            <Panel icon={PackagePlus} title="Dados do produto" action="Produto">
                <div className="grid gap-4 md:grid-cols-2">
                    <Field label="Nome do produto">
                        <input
                            value={name}
                            onChange={(event) => onNameChange(event.target.value)}
                            required
                            minLength={2}
                            className={inputClass}
                            placeholder="Ex.: Cimento CP II"
                        />
                    </Field>
                    <Field label="Marca">
                        <select
                            value={brandId}
                            onChange={(event) => onBrandChange(event.target.value)}
                            className={inputClass}
                        >
                            <option value="">Sem marca</option>
                            {brands.map((brand) => (
                                <option key={brand.id} value={brand.id}>
                                    {brand.name}
                                </option>
                            ))}
                        </select>
                    </Field>
                </div>

                <Field label="Descricao">
                    <textarea
                        value={description}
                        onChange={(event) => onDescriptionChange(event.target.value)}
                        className={`${inputClass} min-h-[120px] resize-y py-3`}
                        placeholder="Resumo comercial e tecnico do produto"
                    />
                </Field>
            </Panel>

            <Panel icon={Layers3} title="Organizacao no catalogo" action="Setor">
                <div className="grid gap-3 md:grid-cols-[1fr_1fr_auto]">
                    <Field label="Categoria">
                        <select
                            value={currentCategoryId}
                            onChange={(event) => onCategoryChange(event.target.value)}
                            className={inputClass}
                        >
                            <option value="">Selecione</option>
                            {categories.map((category) => (
                                <option key={category.id} value={category.id}>
                                    {category.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <Field label="Subcategoria">
                        <select
                            value={currentSubcategoryId}
                            onChange={(event) => onSubcategoryChange(event.target.value)}
                            disabled={!currentCategoryId}
                            className={inputClass}
                        >
                            <option value="">
                                {currentCategoryId ? "Selecione" : "Escolha uma categoria"}
                            </option>
                            {subcategoriesForCategory(categories, currentCategoryId).map((subcategory) => (
                                <option key={subcategory.id} value={subcategory.id}>
                                    {subcategory.name}
                                </option>
                            ))}
                        </select>
                    </Field>

                    <button
                        type="button"
                        onClick={onAddSubcategory}
                        disabled={!currentSubcategoryId}
                        className="mt-5 inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-zinc-950 px-4 text-sm font-extrabold text-white transition-colors hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50 md:mt-6"
                    >
                        <Plus className="h-4 w-4" />
                        Adicionar
                    </button>
                </div>

                <div className="rounded-[8px] border border-zinc-200 bg-zinc-50 p-3">
                    <p className="text-sm font-black text-zinc-900">Vinculos selecionados</p>
                    {selectedSubcategories.length === 0 ? (
                        <p className="mt-2 text-sm font-semibold text-zinc-500">
                            Nenhuma categoria/subcategoria selecionada.
                        </p>
                    ) : (
                        <div className="mt-3 grid gap-2">
                            {selectedSubcategories.map((subcategoryId) => {
                                const match = findSubcategoryInCategories(categories, subcategoryId);

                                return (
                                    <div
                                        key={subcategoryId}
                                        className="flex items-center justify-between gap-3 rounded-[6px] border border-zinc-200 bg-white px-3 py-2"
                                    >
                                        <span className="min-w-0 text-sm font-bold text-zinc-700">
                                            <strong className="text-zinc-950">
                                                {match?.category.name ?? "Categoria"}
                                            </strong>
                                            {" / "}
                                            {match?.subcategory.name ?? `Subcategoria #${subcategoryId}`}
                                        </span>
                                        <button
                                            type="button"
                                            onClick={() => onRemoveSubcategory(subcategoryId)}
                                            className="grid h-8 w-8 shrink-0 place-items-center rounded-[6px] text-zinc-500 transition-colors hover:bg-red-50 hover:text-red-700"
                                            aria-label="Remover vinculo"
                                            title="Remover vinculo"
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </button>
                                    </div>
                                );
                            })}
                        </div>
                    )}
                </div>
            </Panel>

            <Panel icon={CheckCircle2} title="Especificacoes tecnicas" action="Ficha">
                <div className="grid gap-3">
                    {specRows.map((row) => (
                        <div key={row.id} className="grid gap-3 md:grid-cols-[0.42fr_1fr_auto]">
                            <input
                                value={row.label}
                                onChange={(event) => onSpecChange(row.id, "label", event.target.value)}
                                className={inputClass}
                                placeholder="Especificacao"
                            />
                            <input
                                value={row.value}
                                onChange={(event) => onSpecChange(row.id, "value", event.target.value)}
                                className={inputClass}
                                placeholder="Valor"
                            />
                            <button
                                type="button"
                                onClick={() => onRemoveSpec(row.id)}
                                className="grid h-11 w-11 place-items-center rounded-[6px] border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700"
                                aria-label="Remover especificacao"
                                title="Remover especificacao"
                            >
                                <Trash2 className="h-4 w-4" />
                            </button>
                        </div>
                    ))}
                    <button
                        type="button"
                        onClick={onAddSpec}
                        className="inline-flex h-10 w-fit items-center gap-2 rounded-[6px] border border-zinc-300 bg-white px-3 text-sm font-extrabold transition-colors hover:bg-zinc-50"
                    >
                        <Plus className="h-4 w-4" />
                        Adicionar especificacao
                    </button>
                </div>
            </Panel>

            <Panel icon={Upload} title="Fotos do produto" action="Midia">
                <label className="flex min-h-[118px] cursor-pointer flex-col items-center justify-center rounded-[8px] border border-dashed border-zinc-300 bg-zinc-50 px-4 py-5 text-center transition-colors hover:border-zinc-500 hover:bg-white">
                    <Upload className="h-7 w-7 text-zinc-500" />
                    <span className="mt-2 text-sm font-extrabold text-zinc-800">
                        Selecionar fotos
                    </span>
                    <span className="mt-1 text-xs font-semibold text-zinc-500">
                        JPG, PNG ou WEBP
                    </span>
                    <input
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        multiple
                        onChange={(event) => onImagesChange(Array.from(event.target.files ?? []))}
                        className="sr-only"
                    />
                </label>

                {images.length > 0 && (
                    <div className="grid gap-2">
                        {images.map((image, index) => (
                            <div
                                key={`${image.name}-${image.lastModified}`}
                                className="flex items-center justify-between rounded-[6px] border border-zinc-200 bg-white px-3 py-2 text-sm"
                            >
                                <span className="truncate font-bold text-zinc-700">
                                    {index + 1}. {image.name}
                                </span>
                                {index === 0 && (
                                    <span className="rounded-[4px] bg-[#fff3b8] px-2 py-1 text-xs font-black text-zinc-900">
                                        Principal
                                    </span>
                                )}
                            </div>
                        ))}
                    </div>
                )}
            </Panel>
        </>
    );
}

function SkuFields({
    sku,
    price,
    onSkuChange,
    onPriceChange,
}: {
    sku: SkuDraft;
    price: string;
    onSkuChange: (field: keyof SkuDraft, value: string) => void;
    onPriceChange: (value: string) => void;
}) {
    return (
        <Panel icon={Tag} title="SKU, preco e medidas" action="SKU">
            <div className="grid gap-3 md:grid-cols-3">
                <Field label="Variedade">
                    <input
                        value={sku.variant_name}
                        onChange={(event) => onSkuChange("variant_name", event.target.value)}
                        className={inputClass}
                        placeholder="Ex.: Saco 50kg"
                    />
                </Field>
                <Field label="SKU">
                    <input
                        value={sku.sku}
                        onChange={(event) => onSkuChange("sku", event.target.value)}
                        required
                        className={inputClass}
                        placeholder="CIM-VOT-50"
                    />
                </Field>
                <Field label="Codigo de barras">
                    <input
                        value={sku.barcode}
                        onChange={(event) => onSkuChange("barcode", event.target.value)}
                        className={inputClass}
                        placeholder="789..."
                    />
                </Field>
                <Field label="Unidade">
                    <input
                        value={sku.unit}
                        onChange={(event) => onSkuChange("unit", event.target.value)}
                        required
                        className={inputClass}
                        placeholder="un, saco, caixa"
                    />
                </Field>
                <Field label="Preco de venda">
                    <input
                        value={price}
                        onChange={(event) => onPriceChange(event.target.value)}
                        required
                        type="number"
                        min="0.01"
                        step="0.01"
                        className={inputClass}
                        placeholder="0.00"
                    />
                </Field>
                <Field label="Peso">
                    <input
                        value={sku.weight}
                        onChange={(event) => onSkuChange("weight", event.target.value)}
                        type="number"
                        min="0"
                        step="0.001"
                        className={inputClass}
                    />
                </Field>
                <Field label="Comprimento">
                    <input
                        value={sku.length}
                        onChange={(event) => onSkuChange("length", event.target.value)}
                        type="number"
                        min="0"
                        step="0.001"
                        className={inputClass}
                    />
                </Field>
                <Field label="Largura">
                    <input
                        value={sku.width}
                        onChange={(event) => onSkuChange("width", event.target.value)}
                        type="number"
                        min="0"
                        step="0.001"
                        className={inputClass}
                    />
                </Field>
                <Field label="Altura">
                    <input
                        value={sku.height}
                        onChange={(event) => onSkuChange("height", event.target.value)}
                        type="number"
                        min="0"
                        step="0.001"
                        className={inputClass}
                    />
                </Field>
            </div>
        </Panel>
    );
}

function ActionBar({
    title,
    description,
    isSubmitting,
    label,
}: {
    title: string;
    description: string;
    isSubmitting: boolean;
    label: string;
}) {
    return (
        <div className="sticky bottom-0 z-10 flex flex-col gap-3 border border-zinc-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
            <div>
                <p className="text-sm font-black text-zinc-900">{title}</p>
                <p className="text-xs font-semibold text-zinc-500">{description}</p>
            </div>
            <button
                type="submit"
                disabled={isSubmitting}
                className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-zinc-950 px-5 text-sm font-extrabold text-white transition-colors hover:bg-zinc-800 disabled:cursor-wait disabled:opacity-70"
            >
                {isSubmitting ? (
                    <RefreshCcw className="h-4 w-4 animate-spin" />
                ) : (
                    <Save className="h-4 w-4" />
                )}
                {label}
            </button>
        </div>
    );
}

function Overview({
    brandsCount,
    categoriesCount,
    shopsCount,
    onCreateCategory,
    onCreateProduct,
    onCreateSku,
}: {
    brandsCount: number;
    categoriesCount: number;
    shopsCount: number;
    onCreateCategory: () => void;
    onCreateProduct: () => void;
    onCreateSku: () => void;
}) {
    return (
        <div className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-3">
                <Metric icon={Boxes} label="Marcas" value={brandsCount} />
                <Metric icon={Layers3} label="Categorias" value={categoriesCount} />
                <Metric icon={Warehouse} label="Lojas acessiveis" value={shopsCount} />
            </div>

            <div className="grid gap-4 lg:grid-cols-3">
                <section className="grid gap-4 rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm">
                    <div>
                        <h2 className="text-lg font-black text-zinc-950">
                            Criar categorias
                        </h2>
                        <p className="mt-1 text-sm font-semibold leading-relaxed text-zinc-600">
                            Cadastra categorias principais e subcategorias usadas nos selects de
                            organizacao do produto.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCreateCategory}
                        className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-[6px] border border-zinc-300 bg-white px-4 text-sm font-extrabold transition-colors hover:bg-zinc-50"
                    >
                        <Layers3 className="h-4 w-4" />
                        Categorias
                    </button>
                </section>

                <section className="grid gap-4 rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm">
                    <div>
                        <h2 className="text-lg font-black text-zinc-950">
                            Adicionar produto
                        </h2>
                        <p className="mt-1 text-sm font-semibold leading-relaxed text-zinc-600">
                            Cria o produto-base, vincula categorias reais do site, marca, fotos e
                            especificacoes tecnicas.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCreateProduct}
                        className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-[6px] border border-zinc-300 bg-white px-4 text-sm font-extrabold transition-colors hover:bg-zinc-50"
                    >
                        <PackagePlus className="h-4 w-4" />
                        Produto
                    </button>
                </section>

                <section className="grid gap-4 rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm">
                    <div>
                        <h2 className="text-lg font-black text-zinc-950">
                            Adicionar SKU
                        </h2>
                        <p className="mt-1 text-sm font-semibold leading-relaxed text-zinc-600">
                            Seleciona a loja acessivel, pesquisa um produto existente, cria SKU,
                            aplica preco e registra estoque inicial.
                        </p>
                    </div>
                    <button
                        type="button"
                        onClick={onCreateSku}
                        className="inline-flex h-11 w-fit items-center justify-center gap-2 rounded-[6px] bg-zinc-950 px-4 text-sm font-extrabold text-white transition-colors hover:bg-zinc-800"
                    >
                        <Tag className="h-4 w-4" />
                        SKU
                    </button>
                </section>
            </div>
        </div>
    );
}

function Metric({
    icon: Icon,
    label,
    value,
}: {
    icon: React.ComponentType<{ className?: string }>;
    label: string;
    value: number;
}) {
    return (
        <div className="rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm">
            <span className="grid h-10 w-10 place-items-center rounded-[6px] bg-[#FFD900] text-zinc-950">
                <Icon className="h-5 w-5" />
            </span>
            <p className="mt-4 text-2xl font-black text-zinc-950">{value}</p>
            <p className="text-sm font-bold text-zinc-500">{label}</p>
        </div>
    );
}

function Panel({
    icon: Icon,
    title,
    action,
    children,
}: {
    icon: React.ComponentType<{ className?: string }>;
    title: string;
    action: string;
    children: React.ReactNode;
}) {
    return (
        <section className="rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="mb-5 flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-[6px] bg-zinc-100 text-zinc-800">
                        <Icon className="h-5 w-5" />
                    </span>
                    <h2 className="text-base font-black text-zinc-950">{title}</h2>
                </div>
                <span className="rounded-[4px] bg-zinc-100 px-2 py-1 text-xs font-black text-zinc-500">
                    {action}
                </span>
            </div>
            <div className="grid gap-4">{children}</div>
        </section>
    );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
    return (
        <label className="grid gap-2">
            <span className="text-xs font-black uppercase text-zinc-500">{label}</span>
            {children}
        </label>
    );
}

function SummaryLine({ label, value }: { label: string; value: string }) {
    return (
        <div className="flex items-center justify-between gap-3 border-b border-zinc-100 py-2 last:border-b-0">
            <span className="text-sm font-bold text-zinc-500">{label}</span>
            <span className="max-w-[180px] truncate text-right text-sm font-black text-zinc-950">
                {value}
            </span>
        </div>
    );
}

function Notice({ tone, message }: { tone: "success" | "error"; message: string }) {
    const isSuccess = tone === "success";

    return (
        <div
            className={`flex items-start gap-3 rounded-[8px] border p-4 text-sm font-bold ${
                isSuccess
                    ? "border-emerald-200 bg-emerald-50 text-emerald-900"
                    : "border-red-200 bg-red-50 text-red-900"
            }`}
        >
            {isSuccess ? (
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />
            ) : (
                <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
            )}
            {message}
        </div>
    );
}

function flattenSubcategories(subcategories: SubcategoryOption[]): SubcategoryOption[] {
    return subcategories.flatMap((subcategory) => [
        subcategory,
        ...flattenSubcategories(subcategory.children ?? []),
    ]);
}

function subcategoriesForCategory(
    categories: CategoryOption[],
    categoryId: string,
): SubcategoryOption[] {
    const category = categories.find((item) => String(item.id) === categoryId);

    return flattenSubcategories(category?.subcategories ?? []);
}

function rootSubcategoriesForCategory(
    categories: CategoryOption[],
    categoryId: string,
): SubcategoryOption[] {
    const category = categories.find((item) => String(item.id) === categoryId);

    return category?.subcategories ?? [];
}

function findSubcategoryInCategories(
    categories: CategoryOption[],
    subcategoryId: number,
): { category: CategoryOption; subcategory: SubcategoryOption } | null {
    for (const category of categories) {
        const subcategory = flattenSubcategories(category.subcategories ?? [])
            .find((item) => item.id === subcategoryId);

        if (subcategory) {
            return { category, subcategory };
        }
    }

    return null;
}

function addSubcategoryToCategories(
    categories: CategoryOption[],
    categoryId: number,
    parentId: number | null,
    subcategory: SubcategoryOption,
): CategoryOption[] {
    return categories
        .map((category) => {
            if (category.id !== categoryId) {
                return category;
            }

            if (!parentId) {
                return {
                    ...category,
                    subcategories: [
                        ...(category.subcategories ?? []),
                        { ...subcategory, children: subcategory.children ?? [] },
                    ].sort(byName),
                };
            }

            return {
                ...category,
                subcategories: addChildSubcategory(
                    category.subcategories ?? [],
                    parentId,
                    subcategory,
                ),
            };
        })
        .sort(byName);
}

function addChildSubcategory(
    subcategories: SubcategoryOption[],
    parentId: number,
    subcategory: SubcategoryOption,
): SubcategoryOption[] {
    return subcategories.map((item) => {
        if (item.id !== parentId) {
            return item;
        }

        return {
            ...item,
            children: [
                ...(item.children ?? []),
                { ...subcategory, children: subcategory.children ?? [] },
            ].sort(byName),
        };
    });
}

function byName<T extends { name: string }>(first: T, second: T) {
    return first.name.localeCompare(second.name, "pt-BR");
}

function specificationsPayload(rows: SpecRow[]) {
    return Object.fromEntries(
        rows
            .map((row) => [row.label.trim(), row.value.trim()])
            .filter(([label, value]) => label && value),
    );
}

function skuNumberPayload(sku: SkuDraft) {
    return {
        variant_name: sku.variant_name.trim(),
        sku: sku.sku.trim(),
        barcode: sku.barcode.trim(),
        unit: sku.unit.trim(),
        weight: sku.weight,
        length: sku.length,
        width: sku.width,
        height: sku.height,
        transfer_batch_quantity: 1,
        transfer_fee_per_batch: 0,
    };
}

function responseMessage(payload: unknown) {
    if (!payload || typeof payload !== "object") {
        return "Nao foi possivel concluir a acao.";
    }

    const data = payload as { message?: string; errors?: Record<string, string[]> };
    const firstError = data.errors
        ? Object.values(data.errors).flat().find(Boolean)
        : null;

    return firstError ?? data.message ?? "Nao foi possivel concluir a acao.";
}

function errorMessage(error: unknown) {
    return error instanceof Error ? error.message : "Nao foi possivel concluir a acao.";
}

function navClass(isActive: boolean) {
    return [
        "flex h-11 items-center gap-3 rounded-[6px] px-3 text-sm font-extrabold transition-colors",
        isActive
            ? "bg-white text-zinc-950"
            : "text-zinc-400 hover:bg-zinc-900 hover:text-white",
    ].join(" ");
}

const inputClass =
    "h-11 w-full rounded-[6px] border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-950 disabled:cursor-not-allowed disabled:bg-zinc-100 disabled:text-zinc-500";
