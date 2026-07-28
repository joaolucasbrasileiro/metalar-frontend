import { cookies } from "next/headers";

import { HomeHeaderClient, type HeaderUser } from "./HomeHeaderClient";

type BackendHeaderUser = {
    name?: string | null;
    email?: string | null;
};

type MeResponse = {
    data?: BackendHeaderUser;
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

function toHeaderUser(user?: BackendHeaderUser): HeaderUser | null {
    if (!user) {
        return null;
    }

    return {
        name: user.name ?? undefined,
        email: user.email ?? undefined,
    };
}

async function getAuthenticatedHeaderUser(): Promise<HeaderUser | null> {
    const cookieStore = await cookies();
    const accessToken = cookieStore.get("metalar_access_token")?.value;

    if (!accessToken) {
        return null;
    }

    try {
        const response = await fetch(getBackendUrl("/auth/me"), {
            headers: {
                Accept: "application/json",
                Authorization: `Bearer ${accessToken}`,
            },
            cache: "no-store",
        });

        if (!response.ok) {
            return null;
        }

        const payload = (await response.json()) as MeResponse;

        return toHeaderUser(payload.data);
    } catch {
        return null;
    }
}

export async function HomeHeader() {
    const authenticatedUser = await getAuthenticatedHeaderUser();
    const headerKey = authenticatedUser
        ? `${authenticatedUser.email ?? ""}:${authenticatedUser.name ?? ""}`
        : "guest";

    return <HomeHeaderClient key={headerKey} initialUser={authenticatedUser} />;
}
