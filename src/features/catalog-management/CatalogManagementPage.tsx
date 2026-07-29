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
    subcategories?: SubcategoryOption[];
};

type ShopOption = {
    id: number;
    code: string;
    name: string;
};

type OptionsPayload = {
    brands?: BrandOption[];
    categories?: CategoryOption[];
    shops?: ShopOption[];
    message?: string;
};

type ProductPayload = {
    data?: {
        id: number;
        name: string;
        slug: string;
    };
    message?: string;
    errors?: Record<string, string[]>;
};

type SkuPayload = {
    data?: CreatedSku;
    message?: string;
    errors?: Record<string, string[]>;
};

type CreatedSku = {
    id: number;
    sku: string;
    variant_name?: string | null;
    unit: string;
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
    transfer_batch_quantity: string;
    transfer_fee_per_batch: string;
};

type StockDraft = {
    shop_code: string;
    sku: string;
    quantity: string;
    reason: string;
};

type ViewMode = "overview" | "create";

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
    transfer_batch_quantity: "1",
    transfer_fee_per_batch: "0",
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
    const [isLoading, setIsLoading] = React.useState(true);
    const [mode, setMode] = React.useState<ViewMode>("overview");
    const [message, setMessage] = React.useState<string | null>(null);
    const [error, setError] = React.useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isRestocking, setIsRestocking] = React.useState(false);

    const [name, setName] = React.useState("");
    const [description, setDescription] = React.useState("");
    const [brandId, setBrandId] = React.useState("");
    const [selectedSubcategories, setSelectedSubcategories] = React.useState<number[]>([]);
    const [specRows, setSpecRows] = React.useState<SpecRow[]>(initialSpecs);
    const [images, setImages] = React.useState<File[]>([]);
    const [skus, setSkus] = React.useState<SkuDraft[]>([emptySku()]);
    const [createdProduct, setCreatedProduct] = React.useState<ProductPayload["data"] | null>(
        null,
    );
    const [createdSkus, setCreatedSkus] = React.useState<CreatedSku[]>([]);
    const [stockDraft, setStockDraft] = React.useState<StockDraft>({
        shop_code: "",
        sku: "",
        quantity: "",
        reason: "Estoque inicial",
    });

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
                    setStockDraft((draft) => ({
                        ...draft,
                        shop_code: optionsPayload.shops?.[0]?.code ?? "",
                    }));
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

    function resetForm() {
        setName("");
        setDescription("");
        setBrandId("");
        setSelectedSubcategories([]);
        setSpecRows(initialSpecs());
        setImages([]);
        setSkus([emptySku()]);
        setCreatedProduct(null);
        setCreatedSkus([]);
        setStockDraft({
            shop_code: shops[0]?.code ?? "",
            sku: "",
            quantity: "",
            reason: "Estoque inicial",
        });
        setMessage(null);
        setError(null);
    }

    function toggleSubcategory(subcategoryId: number) {
        setSelectedSubcategories((current) => (
            current.includes(subcategoryId)
                ? current.filter((id) => id !== subcategoryId)
                : [...current, subcategoryId]
        ));
    }

    function updateSpec(rowId: string, field: "label" | "value", value: string) {
        setSpecRows((current) => current.map((row) => (
            row.id === rowId ? { ...row, [field]: value } : row
        )));
    }

    function updateSku(rowId: string, field: keyof SkuDraft, value: string) {
        setSkus((current) => current.map((sku) => (
            sku.id === rowId ? { ...sku, [field]: value } : sku
        )));
    }

    async function submitProduct(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();
        setIsSubmitting(true);
        setError(null);
        setMessage(null);

        try {
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

            const createdSkuResponses: CreatedSku[] = [];

            for (const sku of skus.filter((draft) => draft.sku.trim() && draft.unit.trim())) {
                const skuResponse = await fetch("/api/catalog-management/product-skus", {
                    method: "POST",
                    headers: {
                        Accept: "application/json",
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        product_id: productPayload.data.id,
                        ...skuNumberPayload(sku),
                    }),
                });
                const skuPayload = (await skuResponse.json()) as SkuPayload;

                if (!skuResponse.ok || !skuPayload.data) {
                    throw new Error(responseMessage(skuPayload));
                }

                createdSkuResponses.push(skuPayload.data);
            }

            setCreatedProduct(productPayload.data);
            setCreatedSkus(createdSkuResponses);
            setStockDraft((draft) => ({
                ...draft,
                sku: createdSkuResponses[0]?.sku ?? "",
            }));
            setMessage("Produto cadastrado. SKUs disponiveis para reestoque.");
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
            const response = await fetch("/api/catalog-management/stock-adjustments", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify(stockDraft),
            });
            const payload = await response.json();

            if (!response.ok) {
                throw new Error(responseMessage(payload));
            }

            setMessage("Reestoque registrado com sucesso.");
            setStockDraft((draft) => ({
                ...draft,
                quantity: "",
                reason: "Reposicao",
            }));
        } catch (caughtError) {
            setError(errorMessage(caughtError));
        } finally {
            setIsRestocking(false);
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
                        <button
                            type="button"
                            onClick={() => setMode("overview")}
                            className={navClass(mode === "overview")}
                        >
                            <Layers3 className="h-4 w-4" />
                            Visao geral
                        </button>
                        <button
                            type="button"
                            onClick={() => {
                                resetForm();
                                setMode("create");
                            }}
                            className={navClass(mode === "create")}
                        >
                            <PackagePlus className="h-4 w-4" />
                            Novo produto
                        </button>
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
                                    Produtos, SKUs e reestoque
                                </h1>
                            </div>

                            {mode === "create" ? (
                                <button
                                    type="button"
                                    onClick={() => setMode("overview")}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] border border-zinc-300 bg-white px-4 text-sm font-extrabold transition-colors hover:bg-zinc-50"
                                >
                                    <ArrowLeft className="h-4 w-4" />
                                    Voltar
                                </button>
                            ) : (
                                <button
                                    type="button"
                                    onClick={() => {
                                        resetForm();
                                        setMode("create");
                                    }}
                                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-zinc-950 px-4 text-sm font-extrabold text-white transition-colors hover:bg-zinc-800"
                                >
                                    <Plus className="h-4 w-4" />
                                    Adicionar novo produto
                                </button>
                            )}
                        </header>

                        {error && <Notice tone="error" message={error} />}
                        {message && <Notice tone="success" message={message} />}

                        {mode === "overview" ? (
                            <Overview
                                brandsCount={brands.length}
                                categoriesCount={categories.length}
                                shopsCount={shops.length}
                                onCreate={() => {
                                    resetForm();
                                    setMode("create");
                                }}
                            />
                        ) : (
                            <div className="grid gap-5 xl:grid-cols-[1fr_360px]">
                                <form onSubmit={submitProduct} className="grid gap-5">
                                    <Panel
                                        icon={PackagePlus}
                                        title="Dados do produto"
                                        action="Produto"
                                    >
                                        <div className="grid gap-4 md:grid-cols-2">
                                            <Field label="Nome do produto">
                                                <input
                                                    value={name}
                                                    onChange={(event) => setName(event.target.value)}
                                                    required
                                                    minLength={2}
                                                    className={inputClass}
                                                    placeholder="Ex.: Cimento CP II 50kg"
                                                />
                                            </Field>
                                            <Field label="Marca">
                                                <select
                                                    value={brandId}
                                                    onChange={(event) => setBrandId(event.target.value)}
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
                                                onChange={(event) => setDescription(event.target.value)}
                                                className={`${inputClass} min-h-[120px] resize-y py-3`}
                                                placeholder="Resumo comercial e tecnico do produto"
                                            />
                                        </Field>
                                    </Panel>

                                    <Panel icon={Layers3} title="Setor e especificacoes" action="Catalogo">
                                        <div className="grid gap-4">
                                            <div>
                                                <p className="text-sm font-extrabold text-zinc-800">
                                                    Categoria / subcategoria
                                                </p>
                                                <div className="mt-3 grid gap-3">
                                                    {categories.map((category) => (
                                                        <div
                                                            key={category.id}
                                                            className="rounded-[8px] border border-zinc-200 bg-zinc-50 p-3"
                                                        >
                                                            <p className="text-sm font-black text-zinc-950">
                                                                {category.name}
                                                            </p>
                                                            <div className="mt-3 flex flex-wrap gap-2">
                                                                {flattenSubcategories(category.subcategories ?? []).map(
                                                                    (subcategory) => (
                                                                        <label
                                                                            key={subcategory.id}
                                                                            className="inline-flex cursor-pointer items-center gap-2 rounded-[6px] border border-zinc-200 bg-white px-3 py-2 text-sm font-bold text-zinc-700 transition-colors has-[:checked]:border-zinc-950 has-[:checked]:bg-zinc-950 has-[:checked]:text-white"
                                                                        >
                                                                            <input
                                                                                type="checkbox"
                                                                                checked={selectedSubcategories.includes(
                                                                                    subcategory.id,
                                                                                )}
                                                                                onChange={() => toggleSubcategory(subcategory.id)}
                                                                                className="h-4 w-4 accent-[#FFD900]"
                                                                            />
                                                                            {subcategory.name}
                                                                        </label>
                                                                    ),
                                                                )}
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            <div className="grid gap-3">
                                                {specRows.map((row) => (
                                                    <div key={row.id} className="grid gap-3 md:grid-cols-[0.42fr_1fr_auto]">
                                                        <input
                                                            value={row.label}
                                                            onChange={(event) => updateSpec(row.id, "label", event.target.value)}
                                                            className={inputClass}
                                                            placeholder="Especificacao"
                                                        />
                                                        <input
                                                            value={row.value}
                                                            onChange={(event) => updateSpec(row.id, "value", event.target.value)}
                                                            className={inputClass}
                                                            placeholder="Valor"
                                                        />
                                                        <button
                                                            type="button"
                                                            onClick={() => setSpecRows((current) => current.filter((item) => item.id !== row.id))}
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
                                                    onClick={() => setSpecRows((current) => [
                                                        ...current,
                                                        { id: crypto.randomUUID(), label: "", value: "" },
                                                    ])}
                                                    className="inline-flex h-10 w-fit items-center gap-2 rounded-[6px] border border-zinc-300 bg-white px-3 text-sm font-extrabold transition-colors hover:bg-zinc-50"
                                                >
                                                    <Plus className="h-4 w-4" />
                                                    Adicionar especificacao
                                                </button>
                                            </div>
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
                                                onChange={(event) => setImages(Array.from(event.target.files ?? []))}
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

                                    <Panel icon={Boxes} title="SKUs e variedades" action="Variedades">
                                        <div className="grid gap-4">
                                            {skus.map((sku, index) => (
                                                <div
                                                    key={sku.id}
                                                    className="rounded-[8px] border border-zinc-200 bg-zinc-50 p-4"
                                                >
                                                    <div className="flex items-center justify-between gap-3">
                                                        <p className="text-sm font-black text-zinc-900">
                                                            SKU {index + 1}
                                                        </p>
                                                        <button
                                                            type="button"
                                                            onClick={() => setSkus((current) => current.filter((item) => item.id !== sku.id))}
                                                            disabled={skus.length === 1}
                                                            className="grid h-9 w-9 place-items-center rounded-[6px] border border-zinc-200 bg-white text-zinc-500 transition-colors hover:border-red-200 hover:bg-red-50 hover:text-red-700 disabled:cursor-not-allowed disabled:opacity-40"
                                                            aria-label="Remover SKU"
                                                            title="Remover SKU"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                        </button>
                                                    </div>

                                                    <div className="mt-4 grid gap-3 md:grid-cols-3">
                                                        <Field label="Variedade">
                                                            <input
                                                                value={sku.variant_name}
                                                                onChange={(event) => updateSku(sku.id, "variant_name", event.target.value)}
                                                                className={inputClass}
                                                                placeholder="Ex.: Saco 50kg"
                                                            />
                                                        </Field>
                                                        <Field label="SKU">
                                                            <input
                                                                value={sku.sku}
                                                                onChange={(event) => updateSku(sku.id, "sku", event.target.value)}
                                                                required={index === 0}
                                                                className={inputClass}
                                                                placeholder="CIM-VOT-50"
                                                            />
                                                        </Field>
                                                        <Field label="Codigo de barras">
                                                            <input
                                                                value={sku.barcode}
                                                                onChange={(event) => updateSku(sku.id, "barcode", event.target.value)}
                                                                className={inputClass}
                                                                placeholder="789..."
                                                            />
                                                        </Field>
                                                        <Field label="Unidade">
                                                            <input
                                                                value={sku.unit}
                                                                onChange={(event) => updateSku(sku.id, "unit", event.target.value)}
                                                                required={index === 0}
                                                                className={inputClass}
                                                                placeholder="un, saco, caixa"
                                                            />
                                                        </Field>
                                                        <Field label="Peso">
                                                            <input
                                                                value={sku.weight}
                                                                onChange={(event) => updateSku(sku.id, "weight", event.target.value)}
                                                                type="number"
                                                                min="0"
                                                                step="0.001"
                                                                className={inputClass}
                                                            />
                                                        </Field>
                                                        <Field label="Comp.">
                                                            <input
                                                                value={sku.length}
                                                                onChange={(event) => updateSku(sku.id, "length", event.target.value)}
                                                                type="number"
                                                                min="0"
                                                                step="0.001"
                                                                className={inputClass}
                                                            />
                                                        </Field>
                                                        <Field label="Largura">
                                                            <input
                                                                value={sku.width}
                                                                onChange={(event) => updateSku(sku.id, "width", event.target.value)}
                                                                type="number"
                                                                min="0"
                                                                step="0.001"
                                                                className={inputClass}
                                                            />
                                                        </Field>
                                                        <Field label="Altura">
                                                            <input
                                                                value={sku.height}
                                                                onChange={(event) => updateSku(sku.id, "height", event.target.value)}
                                                                type="number"
                                                                min="0"
                                                                step="0.001"
                                                                className={inputClass}
                                                            />
                                                        </Field>
                                                        <Field label="Lote transf.">
                                                            <input
                                                                value={sku.transfer_batch_quantity}
                                                                onChange={(event) => updateSku(sku.id, "transfer_batch_quantity", event.target.value)}
                                                                type="number"
                                                                min="0.001"
                                                                step="0.001"
                                                                className={inputClass}
                                                            />
                                                        </Field>
                                                        <Field label="Taxa lote">
                                                            <input
                                                                value={sku.transfer_fee_per_batch}
                                                                onChange={(event) => updateSku(sku.id, "transfer_fee_per_batch", event.target.value)}
                                                                type="number"
                                                                min="0"
                                                                step="0.01"
                                                                className={inputClass}
                                                            />
                                                        </Field>
                                                    </div>
                                                </div>
                                            ))}
                                            <button
                                                type="button"
                                                onClick={() => setSkus((current) => [...current, emptySku()])}
                                                className="inline-flex h-10 w-fit items-center gap-2 rounded-[6px] border border-zinc-300 bg-white px-3 text-sm font-extrabold transition-colors hover:bg-zinc-50"
                                            >
                                                <Plus className="h-4 w-4" />
                                                Adicionar SKU
                                            </button>
                                        </div>
                                    </Panel>

                                    <div className="sticky bottom-0 z-10 flex flex-col gap-3 border border-zinc-200 bg-white/95 p-4 shadow-sm backdrop-blur sm:flex-row sm:items-center sm:justify-between">
                                        <div>
                                            <p className="text-sm font-black text-zinc-900">
                                                Cadastro de produto
                                            </p>
                                            <p className="text-xs font-semibold text-zinc-500">
                                                Produto, fotos e SKUs serao salvos juntos.
                                            </p>
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
                                            Salvar produto
                                        </button>
                                    </div>
                                </form>

                                <aside className="grid h-fit gap-5 xl:sticky xl:top-5">
                                    <Panel icon={CheckCircle2} title="Resumo" action="Status">
                                        <SummaryLine label="Produto" value={name || "Pendente"} />
                                        <SummaryLine
                                            label="Marca"
                                            value={brands.find((brand) => String(brand.id) === brandId)?.name ?? "Sem marca"}
                                        />
                                        <SummaryLine
                                            label="Setores"
                                            value={`${selectedSubcategories.length} selecionado(s)`}
                                        />
                                        <SummaryLine label="Fotos" value={`${images.length}`} />
                                        <SummaryLine
                                            label="SKUs"
                                            value={`${skus.filter((sku) => sku.sku.trim()).length}`}
                                        />
                                    </Panel>

                                    <form onSubmit={submitStock}>
                                        <Panel icon={Warehouse} title="Reestoque" action="Estoque">
                                            {!createdProduct ? (
                                                <div className="rounded-[8px] border border-amber-200 bg-amber-50 p-4 text-sm font-bold text-amber-900">
                                                    Salve o produto para liberar o reestoque.
                                                </div>
                                            ) : (
                                                <div className="grid gap-3">
                                                    <div className="rounded-[8px] border border-emerald-200 bg-emerald-50 p-3">
                                                        <p className="text-sm font-black text-emerald-950">
                                                            {createdProduct.name}
                                                        </p>
                                                        <p className="text-xs font-bold text-emerald-700">
                                                            Produto #{createdProduct.id}
                                                        </p>
                                                    </div>

                                                    <Field label="Loja">
                                                        <select
                                                            value={stockDraft.shop_code}
                                                            onChange={(event) => setStockDraft((draft) => ({
                                                                ...draft,
                                                                shop_code: event.target.value,
                                                            }))}
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

                                                    <Field label="SKU">
                                                        <select
                                                            value={stockDraft.sku}
                                                            onChange={(event) => setStockDraft((draft) => ({
                                                                ...draft,
                                                                sku: event.target.value,
                                                            }))}
                                                            required
                                                            className={inputClass}
                                                        >
                                                            {createdSkus.map((sku) => (
                                                                <option key={sku.id} value={sku.sku}>
                                                                    {sku.variant_name ? `${sku.variant_name} - ` : ""}
                                                                    {sku.sku}
                                                                </option>
                                                            ))}
                                                        </select>
                                                    </Field>

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
                                                        disabled={isRestocking || createdSkus.length === 0}
                                                        className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-[#FFD900] px-4 text-sm font-black text-zinc-950 transition-colors hover:bg-[#f2ce00] disabled:cursor-not-allowed disabled:opacity-60"
                                                    >
                                                        {isRestocking ? (
                                                            <RefreshCcw className="h-4 w-4 animate-spin" />
                                                        ) : (
                                                            <Warehouse className="h-4 w-4" />
                                                        )}
                                                        Registrar reestoque
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

function Overview({
    brandsCount,
    categoriesCount,
    shopsCount,
    onCreate,
}: {
    brandsCount: number;
    categoriesCount: number;
    shopsCount: number;
    onCreate: () => void;
}) {
    return (
        <div className="grid gap-5">
            <div className="grid gap-4 md:grid-cols-3">
                <Metric icon={Boxes} label="Marcas" value={brandsCount} />
                <Metric icon={Layers3} label="Categorias" value={categoriesCount} />
                <Metric icon={Warehouse} label="Lojas" value={shopsCount} />
            </div>

            <section className="grid gap-4 rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm lg:grid-cols-[1fr_auto] lg:items-center">
                <div>
                    <h2 className="text-lg font-black text-zinc-950">
                        Cadastro de novo produto
                    </h2>
                    <p className="mt-1 max-w-2xl text-sm font-semibold leading-relaxed text-zinc-600">
                        O fluxo cadastra o produto, vincula categorias, recebe fotos, cria SKUs e
                        libera o reestoque inicial.
                    </p>
                </div>
                <button
                    type="button"
                    onClick={onCreate}
                    className="inline-flex h-11 items-center justify-center gap-2 rounded-[6px] bg-zinc-950 px-4 text-sm font-extrabold text-white transition-colors hover:bg-zinc-800"
                >
                    <PackagePlus className="h-4 w-4" />
                    Adicionar novo produto
                </button>
            </section>
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
        <div className={`flex items-start gap-3 rounded-[8px] border p-4 text-sm font-bold ${
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
        transfer_batch_quantity: sku.transfer_batch_quantity,
        transfer_fee_per_batch: sku.transfer_fee_per_batch,
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
    "h-11 w-full rounded-[6px] border border-zinc-300 bg-white px-3 text-sm font-bold text-zinc-950 outline-none transition-colors placeholder:text-zinc-400 focus:border-zinc-950";
