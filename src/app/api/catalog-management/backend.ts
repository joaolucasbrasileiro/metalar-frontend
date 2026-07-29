import { cookies } from "next/headers";
import { NextResponse } from "next/server";

type BackendJson = Record<string, unknown>;

type BackendUserResponse = {
    data?: {
        role?: string | null;
    };
};

export function getBackendUrl(path: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.");
    }

    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${normalizedBaseUrl}${normalizedPath}`;
}

export async function getAccessToken() {
    const cookieStore = await cookies();

    return cookieStore.get("metalar_access_token")?.value;
}

export async function readBackendJson(response: Response): Promise<BackendJson> {
    const text = await response.text();

    if (!text) {
        return {};
    }

    return JSON.parse(text) as BackendJson;
}

export async function requireCatalogManager() {
    const accessToken = await getAccessToken();

    if (!accessToken) {
        return {
            ok: false as const,
            response: NextResponse.json({ message: "Nao autenticado." }, { status: 401 }),
        };
    }

    const response = await fetch(getBackendUrl("/auth/me"), {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });
    const payload = (await readBackendJson(response)) as BackendUserResponse;

    if (!response.ok) {
        return {
            ok: false as const,
            response: NextResponse.json(payload, { status: response.status }),
        };
    }

    if (!["moderator", "admin"].includes(payload.data?.role ?? "")) {
        return {
            ok: false as const,
            response: NextResponse.json(
                { message: "Voce nao tem permissao para gerenciar o catalogo." },
                { status: 403 },
            ),
        };
    }

    return {
        ok: true as const,
        accessToken,
    };
}

export function backendHeaders(accessToken: string, contentType = "application/json") {
    const headers: Record<string, string> = {
        Accept: "application/json",
        Authorization: `Bearer ${accessToken}`,
    };

    if (contentType) {
        headers["Content-Type"] = contentType;
    }

    return headers;
}
