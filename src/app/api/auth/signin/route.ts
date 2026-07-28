import { NextResponse } from "next/server";

type BackendLoginResponse = {
    access_token?: string;
    token_type?: string;
    expires_in?: number;
    user?: unknown;
    message?: string;
    errors?: Record<string, string[]>;
};

function getBackendUrl(path: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.");
    }

    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${normalizedBaseUrl}${normalizedPath}`;
}

function cookieMaxAge(payload: BackendLoginResponse, rememberSession: boolean) {
    if (!rememberSession || typeof payload.expires_in !== "number") {
        return undefined;
    }

    return payload.expires_in;
}

export async function POST(request: Request) {
    const body = await request.json();
    const rememberSession = body.remember === true;

    const backendResponse = await fetch(getBackendUrl("/auth/login"), {
        method: "POST",
        headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({
            login: body.login,
            password: body.password,
        }),
        cache: "no-store",
    });

    const payload = (await backendResponse.json()) as BackendLoginResponse;

    if (!backendResponse.ok || !payload.access_token) {
        return NextResponse.json(payload, {
            status: backendResponse.status,
        });
    }

    const response = NextResponse.json({
        message: "Login realizado com sucesso.",
        user: payload.user,
    });

    response.cookies.set({
        name: "metalar_access_token",
        value: payload.access_token,
        httpOnly: true,
        sameSite: "lax",
        secure: process.env.NODE_ENV === "production",
        path: "/",
        maxAge: cookieMaxAge(payload, rememberSession),
    });

    return response;
}
