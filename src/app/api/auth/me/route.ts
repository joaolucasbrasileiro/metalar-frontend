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

export async function GET() {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("metalar_access_token")?.value;

    if (!accessToken) {
        return NextResponse.json({
            message: "Nao autenticado.",
        }, {
            status: 401,
        });
    }

    const backendResponse = await fetch(getBackendUrl("/auth/me"), {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });

    const payload = await backendResponse.json();

    if (!backendResponse.ok) {
        const response = NextResponse.json(payload, {
            status: backendResponse.status,
        });

        response.cookies.delete("metalar_access_token");

        return response;
    }

    return NextResponse.json(payload);
}
