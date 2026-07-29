import { NextResponse } from "next/server";

import {
    getBackendUrl,
    readBackendJson,
    requireCatalogManager,
} from "../backend";

export async function POST(request: Request) {
    const manager = await requireCatalogManager();

    if (!manager.ok) {
        return manager.response;
    }

    const formData = await request.formData();
    const response = await fetch(getBackendUrl("/admin/product-images"), {
        method: "POST",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${manager.accessToken}`,
        },
        body: formData,
        cache: "no-store",
    });
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, { status: response.status });
}
