import { NextResponse } from "next/server";

import {
    getAccessToken,
    getBackendUrl,
    readBackendJson,
} from "../../account/backend";

export async function POST(request: Request) {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return NextResponse.json({ message: "Nao autenticado." }, { status: 401 });
    }

    const body = await request.json();
    const response = await fetch(getBackendUrl("/cart/items"), {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
            product_sku_id: body.product_sku_id,
            shop_id: body.shop_id,
            promotion_id: body.promotion_id ?? null,
            quantity: body.quantity,
        }),
        cache: "no-store",
    });
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, { status: response.status });
}
