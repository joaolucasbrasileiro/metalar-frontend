"use client";

import Link from "next/link";
import { ArrowLeft, Eye, EyeOff, LockKeyhole, Mail, Save } from "lucide-react";
import * as React from "react";

type ResetPasswordFormProps = {
    email?: string;
    token?: string;
};

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

    return payload.message || "Não foi possível redefinir sua senha.";
}

export function ResetPasswordForm({ email, token }: ResetPasswordFormProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isComplete, setIsComplete] = React.useState(false);
    const [feedback, setFeedback] = React.useState<RecoveryFeedback>(null);
    const [visibleFields, setVisibleFields] = React.useState({
        password: false,
        password_confirmation: false,
    });
    const hasValidLink = Boolean(email && token);

    function toggleField(field: keyof typeof visibleFields) {
        setVisibleFields((current) => ({
            ...current,
            [field]: !current[field],
        }));
    }

    async function handleResetPasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        if (!hasValidLink) {
            setFeedback({
                type: "error",
                message: "Link de recuperação incompleto. Solicite um novo e-mail.",
            });

            return;
        }

        const form = event.currentTarget;
        const formData = new FormData(form);
        const password = String(formData.get("password") ?? "");
        const passwordConfirmation = String(formData.get("password_confirmation") ?? "");

        if (!password || !passwordConfirmation) {
            setFeedback({
                type: "error",
                message: "Preencha a nova senha e a confirmação.",
            });

            return;
        }

        if (password !== passwordConfirmation) {
            setFeedback({
                type: "error",
                message: "A nova senha e a confirmação precisam ser iguais.",
            });

            return;
        }

        setIsSubmitting(true);
        setFeedback(null);

        try {
            const response = await fetch("/api/auth/reset-password", {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    email,
                    token,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
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
            setIsComplete(true);
            setFeedback({
                type: "success",
                message: payload.message || "Senha redefinida com sucesso.",
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

    function renderPasswordField(
        name: keyof typeof visibleFields,
        label: string,
        placeholder: string,
    ) {
        const isVisible = visibleFields[name];

        return (
            <label className="grid gap-2 text-xs font-extrabold">
                {label}
                <span className="relative">
                    <LockKeyhole
                        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                        strokeWidth={2}
                    />
                    <input
                        type={isVisible ? "text" : "password"}
                        name={name}
                        autoComplete="new-password"
                        placeholder={placeholder}
                        disabled={isComplete || !hasValidLink}
                        className="h-12 w-full rounded-[6px] border border-zinc-300 bg-white px-4 pl-12 pr-11 text-sm font-medium outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500] disabled:cursor-not-allowed disabled:bg-zinc-50"
                    />
                    <button
                        type="button"
                        aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
                        onClick={() => toggleField(name)}
                        disabled={isComplete || !hasValidLink}
                        className={`absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full transition-colors hover:bg-zinc-100 disabled:cursor-not-allowed disabled:opacity-50 ${
                            isVisible ? "text-[#c9a900]" : "text-zinc-600"
                        }`}
                    >
                        {isVisible ? (
                            <EyeOff className="h-4 w-4" strokeWidth={2.2} />
                        ) : (
                            <Eye className="h-4 w-4" strokeWidth={2.2} />
                        )}
                    </button>
                </span>
            </label>
        );
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
                    Crie uma nova senha
                </h1>
                <p className="mt-3 max-w-[390px] text-base font-medium leading-relaxed text-zinc-700">
                    Defina uma senha forte para recuperar o acesso à sua conta Metalar.
                </p>

                <form
                    className="mt-8 rounded-[8px] border border-zinc-200 bg-white p-5 shadow-sm sm:p-6"
                    onSubmit={handleResetPasswordSubmit}
                >
                    <label className="grid gap-2 text-xs font-extrabold">
                        E-mail
                        <span className="relative">
                            <Mail
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                                strokeWidth={2}
                            />
                            <input
                                type="email"
                                value={email ?? ""}
                                readOnly
                                className="h-12 w-full rounded-[6px] border border-zinc-300 bg-zinc-50 px-4 pl-12 text-sm font-medium text-zinc-600 outline-none"
                            />
                        </span>
                    </label>

                    <div className="mt-5 grid gap-5">
                        {renderPasswordField("password", "Nova senha", "Digite a nova senha")}
                        {renderPasswordField(
                            "password_confirmation",
                            "Confirmar nova senha",
                            "Repita a nova senha",
                        )}
                    </div>

                    {!hasValidLink && (
                        <p className="mt-5 rounded-[6px] bg-red-50 px-4 py-3 text-sm font-semibold text-red-700">
                            Link de recuperação incompleto. Solicite um novo e-mail para redefinir sua senha.
                        </p>
                    )}

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
                        disabled={isSubmitting || isComplete || !hasValidLink}
                        className="mt-5 flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#FFD900] text-sm font-extrabold text-zinc-950 shadow-sm transition-colors hover:bg-[#f2c500] disabled:cursor-not-allowed disabled:opacity-70"
                    >
                        <Save className="h-5 w-5" strokeWidth={2.2} />
                        {isSubmitting ? "Redefinindo..." : "Redefinir senha"}
                    </button>

                    {isComplete && (
                        <Link
                            href="/signin"
                            className="mt-4 flex h-12 w-full items-center justify-center rounded-[6px] border border-zinc-300 bg-white text-sm font-extrabold text-zinc-950 transition-colors hover:border-zinc-400 hover:bg-zinc-50"
                        >
                            Entrar com nova senha
                        </Link>
                    )}
                </form>
            </div>
        </section>
    );
}
