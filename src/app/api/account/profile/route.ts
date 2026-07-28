import { NextResponse } from "next/server";

import { getAccessToken, getBackendUrl, getCurrentUserId, readBackendJson } from "../backend";

const profileFields = ["name", "email", "birthday", "phone"] as const;

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
    const profilePayload = Object.fromEntries(
        profileFields
            .filter((field) => Object.prototype.hasOwnProperty.call(body, field))
            .map((field) => [field, body[field]]),
    );

    const response = await fetch(getBackendUrl(`/users/${currentUser.userId}`), {
        method: "PATCH",
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
            "Content-Type": "application/json",
        },
        body: JSON.stringify(profilePayload),
        cache: "no-store",
    });
    const payload = await readBackendJson(response);

    return NextResponse.json(payload, {
        status: response.status,
    });
}
