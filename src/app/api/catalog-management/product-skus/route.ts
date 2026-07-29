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
