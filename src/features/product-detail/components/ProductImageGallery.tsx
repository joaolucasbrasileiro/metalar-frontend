"use client";

import Image from "next/image";
import { Package } from "lucide-react";
import * as React from "react";

import type { ProductDetailImage } from "../data";

type ProductImageGalleryProps = {
    images: ProductDetailImage[];
    productName: string;
};

export function ProductImageGallery({ images, productName }: ProductImageGalleryProps) {
    const [selectedIndex, setSelectedIndex] = React.useState(0);
    const selectedImage = images[selectedIndex] ?? null;

    return (
        <div className="grid gap-3">
            <div className="relative grid aspect-square place-items-center overflow-hidden rounded-[8px] border border-zinc-200 bg-white">
                {selectedImage ? (
                    <Image
                        src={selectedImage.url}
                        alt={selectedImage.altText}
                        fill
                        priority
                        sizes="(max-width: 768px) 100vw, 520px"
                        className="object-contain p-5"
                    />
                ) : (
                    <div className="grid place-items-center gap-3 text-zinc-300">
                        <Package className="h-20 w-20" strokeWidth={1.5} />
                        <span className="text-sm font-bold text-zinc-400">{productName}</span>
                    </div>
                )}
            </div>

            {images.length > 1 && (
                <div className="grid grid-cols-5 gap-2 sm:grid-cols-6">
                    {images.map((image, index) => (
                        <button
                            key={`${image.url}-${index}`}
                            type="button"
                            onClick={() => setSelectedIndex(index)}
                            className={`relative aspect-square overflow-hidden rounded-[6px] border bg-white transition-colors ${
                                selectedIndex === index
                                    ? "border-[#FFD900] ring-2 ring-[#FFD900]"
                                    : "border-zinc-200 hover:border-zinc-400"
                            }`}
                            aria-label={`Ver imagem ${index + 1}`}
                        >
                            <Image
                                src={image.url}
                                alt={image.altText}
                                fill
                                sizes="96px"
                                className="object-contain p-2"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
}
