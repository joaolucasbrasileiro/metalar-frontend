"use client";

import { Eye, EyeOff, LockKeyhole, Save, ShieldCheck, X } from "lucide-react";
import * as React from "react";

type AccountPasswordFormProps = {
    onBack: () => void;
};

type AccountFeedback = {
    type: "success" | "error";
    message: string;
} | null;

type AccountApiResponse = {
    message?: string;
    errors?: Record<string, string[]>;
};

function getErrorMessage(payload: AccountApiResponse) {
    if (payload.errors) {
        const firstErrorMessage = Object.values(payload.errors)
            .flat()
            .find((message): message is string => typeof message === "string");

        if (firstErrorMessage) {
            return firstErrorMessage;
        }
    }

    return payload.message || "Não foi possível alterar sua senha. Confira os dados e tente novamente.";
}

export function AccountPasswordForm({ onBack }: AccountPasswordFormProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [feedback, setFeedback] = React.useState<AccountFeedback>(null);
    const [visibleFields, setVisibleFields] = React.useState({
        current_password: false,
        password: false,
        password_confirmation: false,
    });

    function toggleField(field: keyof typeof visibleFields) {
        setVisibleFields((current) => ({
            ...current,
            [field]: !current[field],
        }));
    }

    async function handlePasswordSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const currentPassword = String(formData.get("current_password") ?? "");
        const password = String(formData.get("password") ?? "");
        const passwordConfirmation = String(formData.get("password_confirmation") ?? "");

        if (!currentPassword || !password || !passwordConfirmation) {
            setFeedback({
                type: "error",
                message: "Preencha sua senha atual, a nova senha e a confirmação.",
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
            const response = await fetch("/api/account/password", {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    current_password: currentPassword,
                    password,
                    password_confirmation: passwordConfirmation,
                }),
            });
            const payload = (await response.json()) as AccountApiResponse;

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
                message: payload.message || "Senha atualizada com sucesso.",
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
        autoComplete: string,
        placeholder: string,
    ) {
        const isVisible = visibleFields[name];

        return (
            <label className="grid gap-2 text-xs font-extrabold text-zinc-950">
                {label}
                <span className="relative">
                    <LockKeyhole
                        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                        strokeWidth={2}
                    />
                    <input
                        type={isVisible ? "text" : "password"}
                        name={name}
                        autoComplete={autoComplete}
                        placeholder={placeholder}
                        className="h-12 w-full rounded-[6px] border border-zinc-300 bg-white px-4 pl-12 pr-11 text-sm font-semibold outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                    />
                    <button
                        type="button"
                        aria-label={isVisible ? "Ocultar senha" : "Mostrar senha"}
                        onClick={() => toggleField(name)}
                        className={`absolute right-3 top-1/2 grid h-8 w-8 -translate-y-1/2 place-items-center rounded-full transition-colors hover:bg-zinc-100 ${
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
        <section className="relative rounded-[8px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
            <button
                type="button"
                aria-label="Fechar edição de segurança"
                onClick={onBack}
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
            >
                <X className="h-4 w-4" strokeWidth={2.4} />
            </button>

            <div className="pr-12">
                <div>
                    <p className="text-sm font-extrabold text-zinc-500">Segurança</p>
                    <h2 className="mt-1 text-2xl font-extrabold text-zinc-950">
                        Senha e segurança
                    </h2>
                    <p className="mt-2 max-w-[540px] text-sm font-semibold leading-relaxed text-zinc-600">
                        Altere sua senha usando a senha atual para confirmar que é você.
                    </p>
                </div>
            </div>

            <div className="mt-6 flex gap-3 rounded-[8px] border border-zinc-200 bg-zinc-50 p-4">
                <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-zinc-950" strokeWidth={2.2} />
                <p className="text-sm font-semibold leading-relaxed text-zinc-600">
                    Use pelo menos 8 caracteres com letras maiúsculas, minúsculas, números e símbolos.
                </p>
            </div>

            <form className="mt-6 grid gap-5" onSubmit={handlePasswordSubmit}>
                {renderPasswordField(
                    "current_password",
                    "Senha atual",
                    "current-password",
                    "Digite sua senha atual",
                )}

                <div className="grid gap-5 sm:grid-cols-2">
                    {renderPasswordField(
                        "password",
                        "Nova senha",
                        "new-password",
                        "Digite a nova senha",
                    )}

                    {renderPasswordField(
                        "password_confirmation",
                        "Confirmar nova senha",
                        "new-password",
                        "Repita a nova senha",
                    )}
                </div>

                {feedback && (
                    <p
                        className={`rounded-[6px] px-4 py-3 text-sm font-semibold ${
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
                    className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-[6px] bg-[#FFD900] px-5 text-sm font-extrabold text-zinc-950 transition-colors hover:bg-[#f2c500] disabled:cursor-not-allowed disabled:opacity-70 sm:w-auto"
                >
                    <Save className="h-5 w-5" strokeWidth={2.2} />
                    {isSubmitting ? "Alterando..." : "Alterar senha"}
                </button>
            </form>
        </section>
    );
}
