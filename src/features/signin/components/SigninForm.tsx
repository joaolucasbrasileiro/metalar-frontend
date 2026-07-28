"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Eye, EyeOff, LockKeyhole, Mail, UserPlus } from "lucide-react";
import * as React from "react";

import { SigninSecureNote } from "./SigninSecureNote";

type SigninFeedback = {
    type: "success" | "error";
    message: string;
} | null;

type LoginResponse = {
    user?: unknown;
    message?: string;
    errors?: Record<string, string[]>;
};

function getErrorMessage(payload: LoginResponse): string {
    if (payload.errors) {
        const firstErrorMessage = Object.values(payload.errors)
            .flat()
            .find((message): message is string => typeof message === "string");

        if (firstErrorMessage) {
            return firstErrorMessage;
        }
    }

    if (payload.message) {
        return payload.message;
    }

    return "Não foi possível entrar. Confira seus dados e tente novamente.";
}

function clearLegacyBrowserSession() {
    window.localStorage.removeItem("metalar_access_token");
    window.localStorage.removeItem("metalar_token_type");
    window.localStorage.removeItem("metalar_token_expires_at");
    window.localStorage.removeItem("metalar_user");
    window.sessionStorage.removeItem("metalar_access_token");
    window.sessionStorage.removeItem("metalar_token_type");
    window.sessionStorage.removeItem("metalar_token_expires_at");
    window.sessionStorage.removeItem("metalar_user");
}

export function SigninForm() {
    const router = useRouter();
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [feedback, setFeedback] = React.useState<SigninFeedback>(null);

    async function handleSigninSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const login = String(formData.get("login") ?? "").trim();
        const password = String(formData.get("password") ?? "");
        const rememberSession = formData.get("remember") === "on";

        if (!login || !password) {
            setFeedback({
                type: "error",
                message: "Preencha seu e-mail, CPF ou CNPJ e sua senha para entrar.",
            });

            return;
        }

        setIsSubmitting(true);
        setFeedback(null);

        try {
            const response = await fetch("/api/auth/signin", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    login,
                    password,
                    remember: rememberSession,
                }),
            });

            const payload = (await response.json()) as LoginResponse;

            if (!response.ok) {
                setFeedback({
                    type: "error",
                    message: getErrorMessage(payload),
                });

                return;
            }

            clearLegacyBrowserSession();
            setFeedback({
                type: "success",
                message: "Login realizado com sucesso.",
            });
            router.push("/");
            router.refresh();
        } catch {
            setFeedback({
                type: "error",
                message: "Não foi possível conectar ao servidor. Tente novamente em instantes.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    return (
        <section className="flex items-center px-5 py-8 sm:px-8 lg:px-14 lg:py-12">
            <div className="mx-auto w-full max-w-[460px]">
                <h1 className="text-[32px] font-extrabold leading-tight text-zinc-950 sm:text-[38px]">
                    Bem-vindo de volta!
                </h1>
                <p className="mt-3 max-w-[360px] text-base font-medium leading-relaxed text-zinc-700">
                    Faça login para acessar sua conta e aproveitar todos os benefícios da{" "}
                    <span className="font-extrabold text-[#f2c500]">Metalar</span>.
                </p>

                <form
                    className="mt-8 rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
                    onSubmit={handleSigninSubmit}
                >
                    <label className="grid gap-2 text-xs font-extrabold">
                        E-mail, CPF ou CNPJ
                        <span className="relative">
                            <Mail
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                                strokeWidth={2}
                            />
                            <input
                                type="text"
                                name="login"
                                autoComplete="username"
                                placeholder="seu@email.com, CPF ou CNPJ"
                                className="h-12 w-full rounded-[6px] border border-zinc-300 bg-white px-4 pl-12 text-sm font-medium outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                            />
                        </span>
                    </label>

                    <label className="mt-5 grid gap-2 text-xs font-extrabold">
                        Senha
                        <span className="relative">
                            <LockKeyhole
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                                strokeWidth={2}
                            />
                            <input
                                type={isPasswordVisible ? "text" : "password"}
                                name="password"
                                autoComplete="current-password"
                                placeholder="Digite sua senha"
                                className="h-12 w-full rounded-[6px] border border-zinc-300 bg-white px-4 pl-12 pr-11 text-sm font-medium outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                            />
                            <button
                                type="button"
                                aria-label={isPasswordVisible ? "Ocultar senha" : "Mostrar senha"}
                                onClick={() => setIsPasswordVisible((current) => !current)}
                                className={`absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full transition-colors hover:bg-zinc-100 ${
                                    isPasswordVisible ? "text-[#c9a900]" : "text-zinc-600"
                                }`}
                            >
                                {isPasswordVisible ? (
                                    <EyeOff className="h-4 w-4" strokeWidth={2.2} />
                                ) : (
                                    <Eye className="h-4 w-4" strokeWidth={2.2} />
                                )}
                            </button>
                        </span>
                    </label>

                    <div className="mt-5 flex flex-wrap items-center justify-between gap-3 text-xs font-bold">
                        <label className="flex items-center gap-2 text-zinc-700">
                            <input
                                type="checkbox"
                                name="remember"
                                className="h-4 w-4 rounded border-zinc-300 accent-[#FFD900]"
                            />
                            Lembrar-me
                        </label>

                        <Link href="/forgot-password" className="text-zinc-950 underline-offset-2 hover:underline">
                            Esqueci minha senha
                        </Link>
                    </div>

                    {feedback && (
                        <p
                            className={`mt-5 rounded-[6px] px-4 py-3 text-sm font-semibold ${
                                feedback.type === "success"
                                    ? "bg-emerald-50 text-emerald-700"
                                    : "bg-red-50 text-red-700"
                            }`}
                        >
                            {feedback.message}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="mt-5 flex h-12 w-full items-center justify-center rounded-[6px] bg-[#FFD900] text-sm font-extrabold text-zinc-950 shadow-sm transition-colors hover:bg-[#f2c500] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        {isSubmitting ? "Entrando..." : "Entrar"}
                    </button>

                    <div className="my-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 text-xs font-semibold text-zinc-400">
                        <span className="h-px bg-zinc-200" />
                        ou
                        <span className="h-px bg-zinc-200" />
                    </div>

                    <Link
                        href="/signup"
                        className="flex h-12 w-full items-center justify-center gap-2 rounded-[6px] border border-zinc-300 bg-white text-sm font-extrabold text-zinc-950 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
                    >
                        <UserPlus className="h-5 w-5" strokeWidth={2.2} />
                        Criar uma nova conta
                    </Link>
                </form>

                <SigninSecureNote />
            </div>
        </section>
    );
}
