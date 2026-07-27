import Link from "next/link";
import { ChevronRight, Home } from "lucide-react";

export function SignupBreadcrumb() {
    return (
        <nav
            aria-label="Breadcrumb"
            className="mb-5 flex items-center gap-3 text-xs font-semibold text-zinc-700"
        >
            <Link
                href="/"
                aria-label="Página inicial"
                className="grid h-8 w-8 place-items-center rounded-full transition-colors hover:bg-white"
            >
                <Home className="h-4 w-4" strokeWidth={2} />
            </Link>
            <ChevronRight className="h-4 w-4 text-zinc-500" strokeWidth={2} />
            <span>Cadastrar</span>
        </nav>
    );
}
