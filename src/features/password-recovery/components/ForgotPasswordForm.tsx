"use client";

import Link from "next/link";
import { ArrowLeft, Mail, Send } from "lucide-react";
import * as React from "react";

type RecoveryFeedback = {
    type: "success" | "error";
    message: string;
} | null;

type RecoveryApiResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

function getErrorMessage(payload: RecoveryApiResponse) {
    if (payload.errors) {
        const firstErrorMessage = Object.values(payload.errors)
            .flat()
            .find((message): message is string => typeof message === "string");

        if (firstErrorMessage) {
            return firstErrorMessage;
        }
    }

    return payload.message || "Não foi possível enviar o e-mail de recuperação.";
}

export function ForgotPasswordForm() {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [feedback, setFeedback] = React.useState<RecoveryFeedback>(null);

    async function handleForgotPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const email = String(formData.get("email") ?? "").trim();

        if (!email) {
            setFeedback({
                type: "error",
                message: "Informe o e-mail cadastrado para recuperar sua conta.",
            });

            return;
        }

        setIsSubmitting(true);
        setFeedback(null);

        try {
            const response = await fetch("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({ email }),
            });
            const payload = (await response.json()) as RecoveryApiResponse;

            if (!response.ok) {
                setFeedback({
                    type: "error",
                    message: getErrorMessage(payload),
                });

                return;
            }

            form.reset();
            setFeedback({
                type: "success",
                message: payload.message || "Se o e-mail existir, enviaremos instruções para redefinir a senha.",
            });
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
                <Link
                    href="/signin"
                    className="inline-flex items-center gap-2 text-sm font-extrabold text-zinc-700 transition-colors hover:text-zinc-950"
                >
                    <ArrowLeft className="h-4 w-4" strokeWidth={2.2} />
                    Voltar para login
                </Link>

                <h1 className="mt-6 text-[32px] font-extrabold leading-tight text-zinc-950 sm:text-[38px]">
                    Recupere sua conta
                </h1>
                <p className="mt-3 max-w-[390px] text-base font-medium leading-relaxed text-zinc-700">
                    Informe o e-mail cadastrado e enviaremos um link seguro para criar uma nova senha.
                </p>

                <form
                    className="mt-8 rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
                    onSubmit={handleForgotPasswordSubmit}
                >
                    <label className="grid gap-2 text-xs font-extrabold">
                        E-mail cadastrado
                        <span className="relative">
                            <Mail
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                                strokeWidth={2}
                            />
                            <input
                                type="email"
                                name="email"
                                autoComplete="email"
                                placeholder="seu@email.com"
                                className="h-12 w-full rounded-[6px] border border-zinc-300 bg-white px-4 pl-12 text-sm font-medium outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                            />
                        </span>
                    </label>

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
                        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#FFD900] text-sm font-extrabold text-zinc-950 shadow-sm transition-colors hover:bg-[#f2c500] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <Send className="h-5 w-5" strokeWidth={2.2} />
                        {isSubmitting ? "Enviando..." : "Enviar link de recuperação"}
                    </button>
                </form>
            </div>
        </section>
    );
}
