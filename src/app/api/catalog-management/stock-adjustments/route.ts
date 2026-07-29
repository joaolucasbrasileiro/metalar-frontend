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
    const shopCode = encodeURIComponent(String(body.shop_code ?? ""));
    const sku = encodeURIComponent(String(body.sku ?? ""));
    const response = await fetch(
        getBackendUrl(`/staff/shops/${shopCode}/product-skus/${sku}/stock-adjustments`),
        {
            method: "POST",
            headers: backendHeaders(manager.accessToken),
            body: JSON.stringify({
                quantity: body.quantity,
                reason: body.reason,
            }),
            cache: "no-store",
        },
    );
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, { status: response.status });
}
