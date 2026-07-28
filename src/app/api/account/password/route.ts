import { NextResponse } from "next/server";

import { getAccessToken, getBackendUrl, getCurrentUserId, readBackendJson } from "../backend";

export async function PATCH(request: Request) {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return NextResponse.json(
            { message: "Nao autenticado." },
            { status: 401 },
        );
    }

    const currentUser = await getCurrentUserId(accessToken);

    if (!currentUser.ok) {
        return NextResponse.json(currentUser.payload, {
            status: currentUser.status,
        });
    }

    const body = await request.json();
    const response = await fetch(getBackendUrl(`/users/${currentUser.userId}/password`), {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            current_password: body.current_password,
            password: body.password,
            password_confirmation: body.password_confirmation,
        }),
        cache: "no-store",
    });
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, {
        status: response.status,
    });
}
