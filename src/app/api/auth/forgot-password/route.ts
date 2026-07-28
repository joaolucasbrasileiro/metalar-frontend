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

async function readJson(response: Response) {
    const text = await response.text();

    if (!text) {
        return {};
    }

    return JSON.parse(text) as Record<string, unknown>;
}

export async function POST(request: Request) {
    const body = await request.json();
    const response = await fetch(getBackendUrl("/auth/forgot-password"), {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            email: body.email,
        }),
        cache: "no-store",
    });
    const payload = await readJson(response);

    return NextResponse.json(payload, {
        status: response.status,
    });
}
