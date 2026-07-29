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
    const response = await fetch(getBackendUrl("/admin/subcategories"), {
        method: "POST",
        headers: backendHeaders(manager.accessToken),
        body: JSON.stringify({
            category_id: body.category_id,
            parent_id: body.parent_id || null,
            name: body.name,
            description: body.description || null,
        }),
        cache: "no-store",
    });
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, { status: response.status });
}
