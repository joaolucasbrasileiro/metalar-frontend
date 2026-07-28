import { cookies } from "next/headers";
import { NextResponse } from "next/server";

function getBackendUrl(path: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.");
    }

    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${normalizedBaseUrl}${normalizedPath}`;
}

export async function POST() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("metalar_access_token")?.value;

    if (accessToken) {
        await fetch(getBackendUrl("/auth/logout"), {
            method: "POST",
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        }).catch(() => null);
    }

    const response = NextResponse.json({
        message: "Logout realizado com sucesso.",
    });

    response.cookies.delete("metalar_access_token");

    return response;
}
