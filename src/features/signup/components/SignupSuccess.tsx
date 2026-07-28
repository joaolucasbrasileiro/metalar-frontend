"use client";

import { Check } from "lucide-react";
import Link from "next/link";

export function SignupSuccess() {
    return (
        <section className="flex min-h-[540px] flex-col items-center justify-center rounded-[8px] border border-zinc-200 bg-white px-8 py-12 text-center shadow-sm sm:px-10">
            <div className="relative flex h-28 w-28 items-center justify-center">
                <span className="absolute inset-0 rounded-full bg-[#FFD900]/20 animate-signup-success-ping" />
                <span className="relative flex h-24 w-24 items-center justify-center rounded-full border-4 border-[#FFD900] bg-[#fff8d9] text-zinc-950 shadow-sm animate-signup-success-pop">
                    <Check className="h-12 w-12" strokeWidth={3} />
                </span>
            </div>

            <h2 className="mt-8 text-3xl font-extrabold text-zinc-950">
                Conta criada com sucesso!
            </h2>
            <p className="mt-3 max-w-sm text-base font-semibold leading-7 text-zinc-600">
                Ative sua conta no e-mail que te enviamos.
            </p>

            <Link
                href="/signin"
                className="mt-8 flex h-12 min-w-36 items-center justify-center rounded-[6px] bg-[#FFD900] px-6 text-sm font-extrabold text-zinc-950 shadow-sm transition-colors hover:bg-[#f2c500]"
            >
                Entrar
            </Link>
        </section>
    );
}
