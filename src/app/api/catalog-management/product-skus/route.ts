import { NextResponse } from "next/server";

import {
    backendHeaders,
    getBackendUrl,
    readBackendJson,
    requireCatalogManager,
} from "../backend";

export async function POST(request: Request) {
    const manager = await requireCatalogManager();

    if (!manager.ok) {
        return manager.response;
    }

    const body = await request.json();
    const response = await fetch(getBackendUrl("/admin/product-skus"), {
        method: "POST",
        headers: backendHeaders(manager.accessToken),
        body: JSON.stringify({
            product_id: body.product_id,
            sku: body.sku,
            barcode: body.barcode || null,
            variant_name: body.variant_name || null,
            unit: body.unit,
            weight: body.weight || null,
            length: body.length || null,
            width: body.width || null,
            height: body.height || null,
            transfer_batch_quantity: body.transfer_batch_quantity || 1,
            transfer_fee_per_batch: body.transfer_fee_per_batch || 0,
        }),
        cache: "no-store",
    });
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, { status: response.status });
}

export async function DELETE(request: Request) {
    const manager = await requireCatalogManager();

    if (!manager.ok) {
        return manager.response;
    }

    const body = await request.json();
    const sku = encodeURIComponent(String(body.sku ?? ""));
    const shopCode = body.shop_code ? encodeURIComponent(String(body.shop_code)) : null;

    if (shopCode) {
        const priceResponse = await fetch(
            getBackendUrl(`/staff/shops/${shopCode}/product-skus/${sku}/price`),
            {
                method: "DELETE",
                headers: {
                    Accept: "application/json",
                    Authorization: `Bearer ${manager.accessToken}`,
                },
                cache: "no-store",
            },
        );

        if (!priceResponse.ok && priceResponse.status !== 404) {
            const payload = await readBackendJson(priceResponse);

            return NextResponse.json(payload, { status: priceResponse.status });
        }
    }

    const response = await fetch(getBackendUrl(`/admin/product-skus/${sku}`), {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${manager.accessToken}`,
        },
        cache: "no-store",
    });
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, { status: response.status });
}
