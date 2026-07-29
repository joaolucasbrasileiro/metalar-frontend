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
    const response = await fetch(getBackendUrl("/admin/products"), {
        method: "POST",
        headers: backendHeaders(manager.accessToken),
        body: JSON.stringify({
            brand_id: body.brand_id ?? null,
            subcategory_ids: body.subcategory_ids ?? [],
            name: body.name,
            description: body.description,
            specifications: body.specifications ?? {},
        }),
        cache: "no-store",
    });
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, { status: response.status });
}
