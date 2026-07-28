"use client";

import { CalendarDays, Mail, Phone, Save, UserRound, X } from "lucide-react";
import * as React from "react";

import type { AccountUser } from "./AccountDashboard";

type AccountProfileFormProps = {
    user: AccountUser;
    onBack: () => void;
    onUserUpdated: (user: AccountUser) => void;
};

type AccountFeedback = {
    type: "success" | "error";
    message: string;
} | null;

type AccountApiResponse = {
    data?: AccountUser;
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

    return payload.message || "Não foi possível salvar os dados. Confira as informações e tente novamente.";
}

function onlyNumbers(value: string) {
    return value.replace(/\D/g, "");
}

function toDateInputValue(value?: string | null) {
    if (!value) {
        return "";
    }

    if (/^\d{4}-\d{2}-\d{2}$/.test(value)) {
        return value;
    }

    const match = value.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);

    if (!match) {
        return "";
    }

    return `${match[3]}-${match[2]}-${match[1]}`;
}

export function AccountProfileForm({
    user,
    onBack,
    onUserUpdated,
}: AccountProfileFormProps) {
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [feedback, setFeedback] = React.useState<AccountFeedback>(null);

    async function handleProfileSubmit(event: React.FormEvent<HTMLFormElement>) {
        event.preventDefault();

        const formData = new FormData(event.currentTarget);
        const name = String(formData.get("name") ?? "").trim();
        const email = String(formData.get("email") ?? "").trim();
        const birthday = String(formData.get("birthday") ?? "").trim();
        const phone = onlyNumbers(String(formData.get("phone") ?? ""));

        if (!name || !email || !phone) {
            setFeedback({
                type: "error",
                message: "Preencha nome, e-mail e telefone para salvar.",
            });

            return;
        }

        if (phone.length !== 11) {
            setFeedback({
                type: "error",
                message: "Informe um telefone com DDD e 11 dígitos.",
            });

            return;
        }

        setIsSubmitting(true);
        setFeedback(null);

        try {
            const response = await fetch("/api/account/profile", {
                method: "PATCH",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name,
                    email,
                    birthday: birthday || null,
                    phone,
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

            if (payload.data) {
                onUserUpdated(payload.data);
            }

            window.dispatchEvent(new Event("metalar-account-updated"));
            setFeedback({
                type: "success",
                message: "Dados cadastrais atualizados com sucesso.",
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
        <section className="relative rounded-[8px] border border-zinc-200 bg-white p-6 shadow-sm sm:p-7">
            <button
                type="button"
                aria-label="Fechar edição de dados"
                onClick={onBack}
                className="absolute right-5 top-5 grid h-9 w-9 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-600 transition-colors hover:border-zinc-300 hover:bg-zinc-50 hover:text-zinc-950"
            >
                <X className="h-4 w-4" strokeWidth={2.4} />
            </button>

            <div className="pr-12">
                <div>
                    <p className="text-sm font-extrabold text-zinc-500">Dados cadastrais</p>
                    <h2 className="mt-1 text-2xl font-extrabold text-zinc-950">
                        Editar dados
                    </h2>
                    <p className="mt-2 max-w-[540px] text-sm font-semibold leading-relaxed text-zinc-600">
                        Atualize as informações usadas para contato e identificação da sua conta.
                    </p>
                </div>
            </div>

            <form className="mt-6 grid gap-5" onSubmit={handleProfileSubmit}>
                <label className="grid gap-2 text-xs font-extrabold text-zinc-950">
                    Nome completo
                    <span className="relative">
                        <UserRound
                            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                            strokeWidth={2}
                        />
                        <input
                            type="text"
                            name="name"
                            defaultValue={user.name}
                            autoComplete="name"
                            className="h-12 w-full rounded-[6px] border border-zinc-300 bg-white px-4 pl-12 text-sm font-semibold outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                        />
                    </span>
                </label>

                <div className="grid gap-5 sm:grid-cols-2">
                    <label className="grid gap-2 text-xs font-extrabold text-zinc-950">
                        E-mail
                        <span className="relative">
                            <Mail
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                                strokeWidth={2}
                            />
                            <input
                                type="email"
                                name="email"
                                defaultValue={user.email}
                                autoComplete="email"
                                className="h-12 w-full rounded-[6px] border border-zinc-300 bg-white px-4 pl-12 text-sm font-semibold outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                            />
                        </span>
                    </label>

                    <label className="grid gap-2 text-xs font-extrabold text-zinc-950">
                        Telefone/WhatsApp
                        <span className="relative">
                            <Phone
                                className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                                strokeWidth={2}
                            />
                            <input
                                type="tel"
                                name="phone"
                                defaultValue={user.phone ?? ""}
                                autoComplete="tel"
                                placeholder="(00) 00000-0000"
                                className="h-12 w-full rounded-[6px] border border-zinc-300 bg-white px-4 pl-12 text-sm font-semibold outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                            />
                        </span>
                    </label>
                </div>

                <label className="grid gap-2 text-xs font-extrabold text-zinc-950 sm:max-w-[320px]">
                    Data de nascimento
                    <span className="relative">
                        <CalendarDays
                            className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-500"
                            strokeWidth={2}
                        />
                        <input
                            type="date"
                            name="birthday"
                            defaultValue={toDateInputValue(user.birthday)}
                            className="h-12 w-full rounded-[6px] border border-zinc-300 bg-white px-4 pl-12 text-sm font-semibold outline-none transition-colors focus:border-[#f2c500]"
                        />
                    </span>
                </label>

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
                    {isSubmitting ? "Salvando..." : "Salvar alterações"}
                </button>
            </form>
        </section>
    );
}
