"use client";

import { useRouter } from "next/navigation";
import * as React from "react";

import { AccountActionGrid } from "./AccountActionGrid";
import { AccountBreadcrumb } from "./AccountBreadcrumb";
import { AccountHeaderCard } from "./AccountHeaderCard";
import { AccountLoadingState } from "./AccountLoadingState";
import { AccountLogoutButton } from "./AccountLogoutButton";
import { AccountPasswordForm } from "./AccountPasswordForm";
import { AccountProfileForm } from "./AccountProfileForm";
import { AccountSecurityPanel } from "./AccountSecurityPanel";
import { AccountSummaryPanel } from "./AccountSummaryPanel";

export type AccountUser = {
    id: number;
    name: string;
    email: string;
    birthday?: string | null;
    cpf?: string | null;
    phone?: string | null;
    role?: string | null;
    created_at?: string | null;
};

type MeResponse = {
    data?: AccountUser;
    message?: string;
};

export type AccountView = "actions" | "profile" | "security";

export function AccountDashboard() {
    const router = useRouter();
    const [user, setUser] = React.useState<AccountUser | null>(null);
    const [isLoading, setIsLoading] = React.useState(true);
    const [isSigningOut, setIsSigningOut] = React.useState(false);
    const [activeView, setActiveView] = React.useState<AccountView>("actions");

    React.useEffect(() => {
        let isMounted = true;

        async function loadAccount() {
            try {
                const response = await fetch("/api/auth/me", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    router.replace("/signin");
                    router.refresh();

                    return;
                }

                const payload = (await response.json()) as MeResponse;

                if (isMounted) {
                    setUser(payload.data ?? null);
                }
            } catch {
                router.replace("/signin");
                router.refresh();
            } finally {
                if (isMounted) {
                    setIsLoading(false);
                }
            }
        }

        loadAccount();

        return () => {
            isMounted = false;
        };
    }, [router]);

    async function handleLogout() {
        setIsSigningOut(true);

        try {
            await fetch("/api/auth/logout", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                },
            });
        } finally {
            router.replace("/signin");
            router.refresh();
        }
    }

    if (isLoading || !user) {
        return <AccountLoadingState />;
    }

    return (
        <div className="grid gap-5">
            <AccountBreadcrumb
                activeView={activeView}
                onNavigateHome={() => setActiveView("actions")}
            />

            <AccountHeaderCard user={user} />

            <div className="grid gap-5 lg:grid-cols-[0.78fr_1.22fr]">
                <div className="grid gap-5">
                    <AccountSummaryPanel
                        user={user}
                        isProfileActive={activeView === "profile"}
                        onEditProfile={() => setActiveView("profile")}
                    />
                    <AccountSecurityPanel
                        isSecurityActive={activeView === "security"}
                        onEditSecurity={() => setActiveView("security")}
                    />
                    <AccountLogoutButton
                        isSigningOut={isSigningOut}
                        onLogout={handleLogout}
                    />
                </div>

                {activeView === "actions" && <AccountActionGrid user={user} />}

                {activeView === "profile" && (
                    <AccountProfileForm
                        user={user}
                        onBack={() => setActiveView("actions")}
                        onUserUpdated={setUser}
                    />
                )}

                {activeView === "security" && (
                    <AccountPasswordForm onBack={() => setActiveView("actions")} />
                )}
            </div>
        </div>
    );
}
