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
    const response = await fetch(getBackendUrl("/admin/categories"), {
        method: "POST",
        headers: backendHeaders(manager.accessToken),
        body: JSON.stringify({
            name: body.name,
            description: body.description || null,
        }),
        cache: "no-store",
    });
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, { status: response.status === 204 ? 200 : response.status });
}

export async function DELETE(request: Request) {
    const manager = await requireCatalogManager();

    if (!manager.ok) {
        return manager.response;
    }

    const body = await request.json();
    const categoryId = encodeURIComponent(String(body.id ?? ""));
    const response = await fetch(getBackendUrl(`/admin/categories/${categoryId}`), {
        method: "DELETE",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${manager.accessToken}`,
        },
        cache: "no-store",
    });
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, { status: response.status === 204 ? 200 : response.status });
}
