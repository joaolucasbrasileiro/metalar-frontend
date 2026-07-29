import Link from "next/link";
import { notFound } from "next/navigation";
import { ChevronRight, Package, Ruler } from "lucide-react";

import { HomeFooter } from "../layout/components/HomeFooter";
import { HomeHeader } from "../layout/components/HomeHeader";
import { ProductImageGallery } from "./components/ProductImageGallery";
import { ProductPurchasePanel } from "./components/ProductPurchasePanel";
import { getProductDetail, type ProductDetail, type ProductDetailSku } from "./data";

type ProductDetailPageProps = {
    slug: string;
};

export async function ProductDetailPage({ slug }: ProductDetailPageProps) {
    const product = await getProductDetail(slug);

    if (!product) {
        notFound();
    }

    const firstSku = product.skus[0] ?? null;
    const primarySubcategory = product.subcategories[0] ?? null;

    return (
        <main className="min-h-screen bg-zinc-100 text-zinc-950">
            <HomeHeader />

            <section className="border-b border-zinc-200 bg-white">
                <div className="mx-auto max-w-[1180px] px-4 py-5 sm:px-6 lg:px-0">
                    <nav className="flex flex-wrap items-center gap-2 text-sm font-semibold text-zinc-500">
                        <Link href="/" className="transition-colors hover:text-zinc-950">Home</Link>
                        {primarySubcategory?.category && (
                            <>
                                <ChevronRight className="h-4 w-4" />
                                <span>{primarySubcategory.category.name}</span>
                            </>
                        )}
                        {primarySubcategory && (
                            <>
                                <ChevronRight className="h-4 w-4" />
                                <span>{primarySubcategory.name}</span>
                            </>
                        )}
                        <ChevronRight className="h-4 w-4" />
                        <span className="font-black text-zinc-950">{product.name}</span>
                    </nav>

                    <div className="mt-5 flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
                        <div>
                            <h1 className="max-w-4xl text-2xl font-black leading-tight text-zinc-950 sm:text-3xl">
                                {product.name}
                            </h1>
                            <div className="mt-3 flex flex-wrap gap-2">
                                <span className="rounded-[4px] bg-[#fff3b8] px-2 py-1 text-xs font-black text-zinc-950">
                                    COD: {product.id}
                                </span>
                                {product.brandName && (
                                    <span className="rounded-[4px] bg-zinc-100 px-2 py-1 text-xs font-black text-zinc-600">
                                        {product.brandName}
                                    </span>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="mx-auto grid max-w-[1180px] gap-6 px-4 py-6 sm:px-6 lg:grid-cols-[minmax(0,1fr)_390px] lg:px-0">
                <div className="grid gap-6">
                    <ProductImageGallery images={product.images} productName={product.name} />

                    {product.description && (
                        <section className="rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm">
                            <h2 className="text-xl font-black text-zinc-950">Descricao</h2>
                            <p className="mt-3 whitespace-pre-line text-sm font-medium leading-relaxed text-zinc-600">
                                {product.description}
                            </p>
                        </section>
                    )}

                    <ProductSpecs product={product} firstSku={firstSku} />
                </div>

                <ProductPurchasePanel product={product} />
            </section>

            <HomeFooter />
        </main>
    );
}

function ProductSpecs({
    product,
    firstSku,
}: {
    product: ProductDetail;
    firstSku: ProductDetailSku | null;
}) {
    const specs = Object.entries(product.specifications);
    const hasDimensions = Boolean(
        firstSku?.dimensions.length || firstSku?.dimensions.width || firstSku?.dimensions.height,
    );

    return (
        <section className="grid gap-6 lg:grid-cols-[0.8fr_1fr]">
            <div className="rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="mb-4 flex items-center gap-3">
                    <span className="grid h-10 w-10 place-items-center rounded-[6px] bg-zinc-100 text-zinc-800">
                        <Ruler className="h-5 w-5" />
                    </span>
                    <h2 className="text-xl font-black text-zinc-950">Dimensoes</h2>
                </div>

                {hasDimensions && firstSku ? (
                    <div className="grid gap-3 sm:grid-cols-3 lg:grid-cols-1">
                        <Dimension label="Comprimento" value={firstSku.dimensions.length} />
                        <Dimension label="Largura" value={firstSku.dimensions.width} />
                        <Dimension label="Altura" value={firstSku.dimensions.height} />
                    </div>
                ) : (
                    <div className="grid min-h-48 place-items-center rounded-[8px] bg-zinc-50 text-center">
                        <div className="grid gap-2 text-zinc-400">
                            <Package className="mx-auto h-12 w-12" strokeWidth={1.5} />
                            <p className="text-sm font-bold">Dimensoes nao informadas.</p>
                        </div>
                    </div>
                )}
            </div>

            <div className="rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm">
                <h2 className="text-xl font-black text-zinc-950">Informacoes gerais</h2>
                <dl className="mt-4 grid gap-3">
                    {product.brandName && (
                        <SpecLine label="Marca" value={product.brandName} />
                    )}
                    {firstSku && (
                        <>
                            <SpecLine label="SKU principal" value={firstSku.sku} />
                            <SpecLine label="Unidade de venda" value={firstSku.unit} />
                        </>
                    )}
                    {specs.length === 0 ? (
                        <p className="text-sm font-semibold text-zinc-500">
                            Nenhuma especificacao cadastrada.
                        </p>
                    ) : (
                        specs.map(([label, value]) => (
                            <SpecLine key={label} label={label} value={value} />
                        ))
                    )}
                </dl>
            </div>
        </section>
    );
}

function Dimension({ label, value }: { label: string; value: number | null }) {
    return (
        <div className="rounded-[8px] border border-zinc-200 bg-zinc-50 p-4">
            <dt className="text-xs font-black uppercase text-zinc-500">{label}</dt>
            <dd className="mt-1 text-lg font-black text-zinc-950">
                {value !== null ? `${formatNumber(value)} cm` : "Nao informado"}
            </dd>
        </div>
    );
}

function SpecLine({ label, value }: { label: string; value: string }) {
    return (
        <div className="grid gap-1 border-b border-zinc-100 pb-3 last:border-b-0 sm:grid-cols-[180px_1fr]">
            <dt className="text-sm font-black text-zinc-950">{label}</dt>
            <dd className="text-sm font-medium leading-relaxed text-zinc-600">{value}</dd>
        </div>
    );
}

function formatNumber(value: number) {
    return new Intl.NumberFormat("pt-BR", {
        maximumFractionDigits: value % 1 === 0 ? 0 : 2,
    }).format(value);
}
