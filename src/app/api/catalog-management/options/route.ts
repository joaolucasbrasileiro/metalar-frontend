import { NextResponse } from "next/server";

import {
    getBackendUrl,
    readBackendJson,
    requireCatalogManager,
} from "../backend";

export async function GET() {
    const manager = await requireCatalogManager();

    if (!manager.ok) {
        return manager.response;
    }

    const headers = {
        Accept: "application/json",
        Authorization: `Bearer ${manager.accessToken}`,
    };

    const [brandsResponse, categoriesResponse, shopsResponse] = await Promise.all([
        fetch(getBackendUrl("/brands"), { headers, cache: "no-store" }),
        fetch(getBackendUrl("/categories"), { headers, cache: "no-store" }),
        fetch(getBackendUrl("/staff/shops"), { headers, cache: "no-store" }),
    ]);

    const [brands, categories, shops] = await Promise.all([
        readBackendJson(brandsResponse),
        readBackendJson(categoriesResponse),
        readBackendJson(shopsResponse),
    ]);

    const failedResponse = [brandsResponse, categoriesResponse, shopsResponse]
        .find((response) => !response.ok);

    if (failedResponse) {
        return NextResponse.json(
            { message: "Nao foi possivel carregar os dados do catalogo." },
            { status: failedResponse.status },
        );
    }

    return NextResponse.json({
        brands: brands.data ?? [],
        categories: categories.data ?? [],
        shops: shops.data ?? [],
    });
}
