import { cookies } from "next/headers";

type BackendJson = Record<string, unknown>;

type BackendUserResponse = {
    data?: {
        id?: number;
    };
    message?: string;
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

export async function getCurrentUserId(accessToken: string) {
    const response = await fetch(getBackendUrl("/auth/me"), {
        headers: {
            Accept: "application/json",
            Authorization: `Bearer ${accessToken}`,
        },
        cache: "no-store",
    });
    const payload = (await readBackendJson(response)) as BackendUserResponse;

    if (!response.ok || typeof payload.data?.id !== "number") {
        return {
            ok: false as const,
            status: response.status,
            payload,
        };
    }

    return {
        ok: true as const,
        userId: payload.data.id,
    };
}
