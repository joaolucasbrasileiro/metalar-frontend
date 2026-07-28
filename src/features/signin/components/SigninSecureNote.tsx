import { ShieldCheck } from "lucide-react";

export function SigninSecureNote() {
    return (
        <div className="mt-6 flex items-start justify-center gap-3 text-center text-sm text-zinc-700">
            <ShieldCheck
                className="mt-0.5 h-5 w-5 shrink-0 text-zinc-950"
                strokeWidth={2.2}
            />
            <p>
                <strong className="block font-extrabold">Acesso 100% seguro</strong>
                <span className="text-zinc-600">
                    Seus dados são protegidos com criptografia de ponta.
                </span>
            </p>
        </div>
    );
}
