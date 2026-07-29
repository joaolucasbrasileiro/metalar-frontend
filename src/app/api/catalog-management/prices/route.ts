import { NextResponse } from "next/server";

import {
    backendHeaders,
    getBackendUrl,
    readBackendJson,
    requireCatalogManager,
} from "../backend";

export async function PUT(request: Request) {
    const manager = await requireCatalogManager();

    if (!manager.ok) {
        return manager.response;
    }

    const body = await request.json();
    const shopCode = encodeURIComponent(String(body.shop_code ?? ""));
    const sku = encodeURIComponent(String(body.sku ?? ""));
    const response = await fetch(
        getBackendUrl(`/staff/shops/${shopCode}/product-skus/${sku}/price`),
        {
            method: "PUT",
            headers: backendHeaders(manager.accessToken),
            body: JSON.stringify({
                price: body.price,
            }),
            cache: "no-store",
        },
    );
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, { status: response.status });
}
