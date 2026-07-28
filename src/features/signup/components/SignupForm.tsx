"use client";

import Link from "next/link";
import { Eye } from "lucide-react";
import * as React from "react";

import { accountTypes, type AccountTypeId } from "../data";
import { SignupSuccess } from "./SignupSuccess";

type SignupFeedback = {
    type: "success" | "error";
    message: string;
} | null;

const requiredFields = [
    { name: "name", label: "nome completo" },
    { name: "email", label: "e-mail" },
    { name: "phone", label: "telefone/WhatsApp" },
    { name: "password", label: "senha" },
    { name: "password_confirmation", label: "confirmação de senha" },
];

function getApiUrl(path: string) {
    const baseUrl = process.env.NEXT_PUBLIC_API_URL?.trim();

    if (!baseUrl) {
        throw new Error("NEXT_PUBLIC_API_URL is not configured.");
    }

    const normalizedBaseUrl = baseUrl.replace(/\/+$/, "");
    const normalizedPath = path.startsWith("/") ? path : `/${path}`;

    return `${normalizedBaseUrl}${normalizedPath}`;
}

function getErrorMessage(payload: unknown): string {
    if (
        payload &&
        typeof payload === "object" &&
        "errors" in payload &&
        payload.errors &&
        typeof payload.errors === "object"
    ) {
        const errorMessages = Object.values(payload.errors).flat();
        const firstErrorMessage = errorMessages.find(
            (message): message is string => typeof message === "string",
        );

        if (firstErrorMessage) {
            return firstErrorMessage;
        }
    }

    if (
        payload &&
        typeof payload === "object" &&
        "message" in payload &&
        typeof payload.message === "string"
    ) {
        return payload.message;
    }

    return "Não foi possível criar sua conta. Confira os dados e tente novamente.";
}

function getMissingFieldMessage(formData: FormData, documentLabel: string, documentFieldName: "cnpj" | "cpf") {
    const document = formData.get(documentFieldName);

    if (typeof document !== "string" || document.trim() === "") {
        return `Preencha o campo ${documentLabel} para continuar.`;
    }

    const missingField = requiredFields.find(({ name }) => {
        const value = formData.get(name);

        return typeof value !== "string" || value.trim() === "";
    });

    if (missingField) {
        return `Preencha o campo ${missingField.label} para continuar.`;
    }

    if (formData.get("rules") !== "on") {
        return "Aceite os Termos de Uso e a Política de Privacidade para continuar.";
    }

    return null;
}

export function SignupForm() {
    const [accountType, setAccountType] = React.useState<AccountTypeId>("individual");
    const [isSubmitting, setIsSubmitting] = React.useState(false);
    const [isSignupComplete, setIsSignupComplete] = React.useState(false);
    const [feedback, setFeedback] = React.useState<SignupFeedback>(null);
    const documentLabel = accountType === "company" ? "CNPJ" : "CPF";
    const documentPlaceholder =
        accountType === "company" ? "00.000.000/0000-00" : "000.000.000-00";
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);
    const [isPasswordConfirmationVisible, setIsPasswordConfirmationVisible] = React.useState(false);
    const documentFieldName = accountType === "company" ? "cnpj" : "cpf"; 

    async function handleSignupSubmit(
        event: React.SyntheticEvent<HTMLFormElement, SubmitEvent>,
    ) {
        event.preventDefault();

        const form = event.currentTarget;
        const formData = new FormData(form);
        const password = String(formData.get("password") ?? "");
        const passwordConfirmation = String(formData.get("password_confirmation") ?? "");
        const missingFieldMessage = getMissingFieldMessage(formData, documentLabel, documentFieldName);

        if (missingFieldMessage) {
            setFeedback({
                type: "error",
                message: missingFieldMessage,
            });

            return;
        }

        if (password !== passwordConfirmation) {
            setFeedback({
                type: "error",
                message: "As senhas precisam ser iguais.",
            });

            return;
        }

        setIsSubmitting(true);
        setFeedback(null);

        try {
            const response = await fetch(getApiUrl("/auth/register"), {
                method: "POST",
                headers: {
                    Accept: "application/json",
                    "Content-Type": "application/json",
                },
                body: JSON.stringify({
                    name: formData.get("name"),
                    email: formData.get("email"),
                    person_type: accountType,
                    [documentFieldName]: formData.get(documentFieldName),
                    phone: formData.get("phone"),
                    rules: formData.get("rules") === "on",
                    password,
                }),
            });

            const payload = (await response.json()) as unknown;

            if (!response.ok) {
                setFeedback({
                    type: "error",
                    message: getErrorMessage(payload),
                });

                return;
            }

            form.reset();
            setAccountType("individual");
            setIsSignupComplete(true);
        } catch {
            setFeedback({
                type: "error",
                message: "Não foi possível conectar ao servidor. Tente novamente em instantes.",
            });
        } finally {
            setIsSubmitting(false);
        }
    }

    if (isSignupComplete) {
        return <SignupSuccess />;
    }

    return (
        <section className="rounded-[8px] border border-zinc-200 bg-white p-8 shadow-sm sm:p-10">
            <h2 className="text-2xl font-extrabold text-zinc-950">Cadastre-se</h2>
            <p className="mt-2 text-sm font-medium text-zinc-600">
                Preencha os dados abaixo para criar sua conta
            </p>

            <form className="mt-6 grid gap-4" onSubmit={handleSignupSubmit}>
                <div className="grid gap-3 sm:grid-cols-2">
                    {accountTypes.map((type) => {
                        const Icon = type.icon;
                        const isSelected = accountType === type.id;

                        return (
                            <button
                                key={type.id}
                                type="button"
                                onClick={() => setAccountType(type.id)}
                                className={`flex min-h-[64px] items-center gap-3 rounded-[8px] border p-4 text-left transition-colors ${
                                    isSelected
                                        ? "border-[#f2c500] bg-[#fff8d9]"
                                        : "border-zinc-200 bg-white hover:border-zinc-300"
                                }`}
                            >
                                <Icon
                                    className="h-7 w-7 shrink-0 text-zinc-950"
                                    strokeWidth={2}
                                />
                                <span>
                                    <strong className="block text-sm font-extrabold">
                                        {type.label}
                                    </strong>
                                    <span className="mt-0.5 block text-xs font-semibold text-zinc-500">
                                        {type.description}
                                    </span>
                                </span>
                            </button>
                        );
                    })}
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-xs font-extrabold">
                        Nome completo
                        <input
                            type="text"
                            name="name"
                            placeholder="Digite seu nome completo"
                            className="h-11 rounded-[6px] border border-zinc-300 bg-white px-4 text-sm font-medium outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                        />
                    </label>

                    <label className="grid gap-2 text-xs font-extrabold">
                        E-mail
                        <input
                            type="email"
                            name="email"
                            placeholder="seu@email.com"
                            className="h-11 rounded-[6px] border border-zinc-300 bg-white px-4 text-sm font-medium outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                        />
                    </label>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                    <label className="grid gap-2 text-xs font-extrabold">
                        {documentLabel}
                        <input
                            type="text"
                            name={documentFieldName}
                            placeholder={documentPlaceholder}
                            className="h-11 rounded-[6px] border border-zinc-300 bg-white px-4 text-sm font-medium outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                        />
                    </label>

                    <label className="grid gap-2 text-xs font-extrabold">
                        Telefone / WhatsApp
                        <input
                            type="tel"
                            name="phone"
                            placeholder="(11) 99999-9999"
                            className="h-11 rounded-[6px] border border-zinc-300 bg-white px-4 text-sm font-medium outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                        />
                    </label>
                </div>

                <label className="grid gap-2 text-xs font-extrabold">
                    Senha
                    <span className="relative">
                        <input
                            type={isPasswordVisible ? "text" : "password"}
                            name="password"
                            placeholder="Digite sua senha"
                            className="h-11 w-full rounded-[6px] border border-zinc-300 bg-white px-4 pr-11 text-sm font-medium outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                        />
                        <button 
                            type="button"
                            onClick={() => setIsPasswordVisible((current) => (!current))}
                            className={`absolute right-3 top-1/2 -translate-y-1/2
                                ${isPasswordVisible ? "text-[#FFD900]" : "text-zinc-600"}`}>
                            <Eye className="h-4 w-4" />
                        </button>
                    </span>
                </label>

                <label className="grid gap-2 text-xs font-extrabold">
                    Confirmar senha
                    <span className="relative">
                        <input
                            type={isPasswordConfirmationVisible ? "text" : "password"}
                            name="password_confirmation"
                            placeholder="Confirme sua senha"
                            className="h-11 w-full rounded-[6px] border border-zinc-300 bg-white px-4 pr-11 text-sm font-medium outline-none transition-colors placeholder:text-zinc-400 focus:border-[#f2c500]"
                        />
                        <button 
                            type="button"
                            onClick={() => setIsPasswordConfirmationVisible((current) => (!current))}
                            className={`absolute right-3 top-1/2 -translate-y-1/2
                                ${isPasswordConfirmationVisible ? "text-[#FFD900]" : "text-zinc-600"}`}>
                            <Eye className="h-4 w-4" />
                        </button>
                    </span>
                </label>

                <label className="flex items-start gap-2 text-xs font-medium text-zinc-700">
                    <input
                        type="checkbox"
                        name="rules"
                        className="mt-0.5 h-4 w-4 rounded border-zinc-300 accent-[#FFD900]"
                    />
                    <span>
                        Li e aceito os{" "}
                        <Link href="/termos" className="font-bold text-black-900 hover:underline">
                            Termos de Uso
                        </Link>{" "}
                        e a{" "}
                        <Link
                            href="/politica-de-privacidade"
                            className="font-bold text-black-900 hover:underline"
                        >
                            Política de Privacidade
                        </Link>
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
                    className="mt-1 flex h-12 items-center justify-center rounded-[6px] bg-[#FFD900] text-sm font-extrabold text-zinc-950 shadow-sm transition-colors hover:bg-[#f2c500] disabled:cursor-not-allowed disabled:opacity-70"
                >
                    {isSubmitting ? "Criando conta..." : "Criar conta"}
                </button>

                <p className="text-center text-sm font-medium text-zinc-600">
                    Já tem uma conta?{" "}
                    <Link href="/signin" className="font-extrabold text-black-900 hover:underline">
                        Entrar
                    </Link>
                </p>
            </form>
        </section>
    );
}
