"use client";
import { useEffect, useState } from "react";

import Image from "next/image";
import Link from "next/link";
import { Search, Heart, UserRound, ShoppingCart, Menu, X } from "lucide-react";

const optionList = [
    { label: "Mais Vendidos", href: "/mais-vendidos" },
    { label: "Ofertas", href: "/ofertas" },
    { label: "Novidades", href: "/novidades" },
    { label: "Serviços", href: "/servicos" },
    { label: "Banheiro", href: "/servicsdos" },
]

const departmentList = [
  { label: "Materiais de Construção", href: "/departamentos/materiais-de-construcao" },
  { label: "Ferramentas", href: "/departamentos/ferramentas" },
  { label: "Tintas e Acessórios", href: "/departamentos/tintas-e-acessorios" },
  { label: "Elétrica", href: "/departamentos/eletrica" },
  { label: "Hidráulica", href: "/departamentos/hidraulica" },
];

type HeaderUser = {
    name?: string;
    email?: string;
};

export function HomeHeader() {
    const [isDepartmentsHovered, setIsDepartmentsHovered] = useState(false);
    const [isDepartmentsPinned, setIsDepartmentsPinned] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [authenticatedUser, setAuthenticatedUser] = useState<HeaderUser | null>(null);
    const cartItemsCount: number = 0;

    const isDepartmentsOpen = isDepartmentsHovered || isDepartmentsPinned;
    const cartItemsLabel = cartItemsCount === 1 ? "1 produto" : `${cartItemsCount} produtos`;
    const accountHref = authenticatedUser ? "/account" : "/signin";
    const accountLabel = authenticatedUser ? "Minha Conta" : "Bem-vindo!";
    const accountAction = authenticatedUser
        ? authenticatedUser.name || authenticatedUser.email || "Acessar conta"
        : "Login";

    useEffect(() => {
        let isMounted = true;

        async function loadAuthenticatedUser() {
            try {
                const response = await fetch("/api/auth/me", {
                    cache: "no-store",
                });

                if (!response.ok) {
                    if (isMounted) {
                        setAuthenticatedUser(null);
                    }

                    return;
                }

                const payload = (await response.json()) as { data?: HeaderUser };

                if (isMounted) {
                    setAuthenticatedUser(payload.data ?? null);
                }
            } catch {
                if (isMounted) {
                    setAuthenticatedUser(null);
                }
            }
        }

        loadAuthenticatedUser();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <header className="bg-[#FFD900] text-zinc-950">
            <div className="mx-auto flex max-w-[1320px] items-center gap-3 px-4 py-3 sm:px-[25px] lg:gap-10 lg:py-4">
                <Image 
                src="/logo.svg" 
                alt="Metalar" 
                width={120} height={48} 
                priority
                className="h-auto w-28 shrink-0 sm:w-32 lg:-mt-3"
            />

            <div className="relative hidden flex-1 md:flex">
                <Search
                className="pointer-events-none
                absolute
                left-4
                top-1/2
                h-5
                w-5
                -translate-y-1/2
                text-zinc-400
                "
                strokeWidth={2} 
                />

                <input 
                className="h-[50px] 
                w-full 
                rounded-[10px] 
                bg-[#fff]
                px-4
                pl-12
                text-sm
                text-zinc-900
                outline-none
                transition-all duration-200 ease-in-out
                border-2
                border-transparent
                focus:border-[#E5E5E5]"
                type="search"
                placeholder="O que você procura?"
                />
            </div>
            <div className="ml-auto flex items-center gap-1 text-zinc-950 sm:gap-2 lg:gap-3">
                <a
                href="/favorites"
                aria-label="Favoritos"
                className="grid h-10 w-10 place-items-center rounded-full transition-colors duration-200 hover:text-[#D71920] sm:h-12 sm:w-12">
                    <Heart className="h-6 w-6 sm:h-7 sm:w-7" strokeWidth={1.7}/>
                </a>
                <div className="group grid h-10 w-10 place-items-center rounded-full transition-colors duration-200 hover: sm:h-12 sm:w-12 lg:flex lg:w-auto lg:gap-2 lg:px-3">
                    <Link href={accountHref} aria-label="Minha conta" className="grid place-items-center group-hover:text-[#D71920]">
                        <UserRound className="h-6 w-6 shrink-0 sm:h-7 sm:w-7" strokeWidth={1.7}/>
                    </Link>
                    <span className="hidden flex-col leading-tight lg:flex">
                        <span className="text-xs font-semibold">{accountLabel}</span>
                        <span className="text-[11px] font-medium">
                            {authenticatedUser ? (
                                <Link href={accountHref} className="font-semibold hover:underline hover:text-[#D71920]">
                                    {accountAction}
                                </Link>
                            ) : (
                                <>
                                    Faça{" "}
                                    <Link href="/signin" className="font-semibold hover:underline hover:text-[#D71920]">
                                        Login
                                    </Link>{" "}
                                    ou{" "}
                                    <Link href="/signup" className="font-semibold hover:underline hover:text-[#D71920]">
                                        Cadastre-se
                                    </Link>
                                </>
                            )}
                        </span>
                    </span>
                </div>
                <a
                href="#"
                aria-label="Carrinho"
                className="group grid h-10 w-10 place-items-center rounded-full transition-colors duration-200 sm:h-12 sm:w-12 lg:flex lg:w-auto lg:gap-2 lg:px-3">
                    <ShoppingCart className="h-6 w-6 shrink-0 sm:h-7 sm:w-7 group-hover:text-[#D71920]" strokeWidth={1.7}/>
                    <span className="hidden flex-col leading-tight lg:flex">
                        <span className="text-xs font-semibold">Carrinho</span>
                        <span className="text-[11px] font-medium">{cartItemsLabel}</span>
                    </span>
                </a>
            </div>

            </div>

            <div className="mx-auto max-w-[1320px] px-4 pb-3 sm:px-[25px] md:hidden">
                <div className="relative flex">
                    <Search
                        className="pointer-events-none absolute left-4 top-1/2 h-5 w-5 -translate-y-1/2 text-zinc-400"
                        strokeWidth={2}
                    />

                    <input
                        className="h-11 w-full rounded-[10px] border-2 border-transparent bg-white px-4 pl-12 text-sm text-zinc-900 outline-none transition-all duration-200 ease-in-out focus:border-[#E5E5E5]"
                        type="search"
                        placeholder="O que você procura?"
                    />
                </div>
            </div>

            <nav className="relative hidden bg-[#FFD900] lg:block">
                <div className="mx-auto flex h-[48px] max-w-[1320px] items-center px-[25px]">
                    <div
                    className="h-full"
                    onMouseEnter={() => setIsDepartmentsHovered(true)}
                    onMouseLeave={() => setIsDepartmentsHovered(false)}
                    >
                    <button type="button"
                    aria-expanded={isDepartmentsOpen}
                    aria-controls="departments-menu"
                    onClick={() => setIsDepartmentsPinned((currentState) => !currentState)}
                    className={`relative
                    mr-14
                    flex
                    h-full
                    items-center
                    gap-2
                    text-base
                    font-semibold
                    text-zinc-950
                    after:absolute
                    after:bottom-0
                    after:left-0
                    after:h-[3px]
                    after:w-full
                    after:rounded-full
                    after:bg-[#D71920]
                    after:transition-opacity
                    after:duration-200
                    hover:after:opacity-100
                    focus-visible:after:opacity-100
                    ${isDepartmentsOpen ? "after:opacity-100" : "after:opacity-0"}`}>
                        <Menu className="h-5 w-5" strokeWidth={2.2}/>Departamentos
                    </button>

                    {isDepartmentsOpen && (
                        <div
                        id="departments-menu"
                        className="absolute left-0 top-full z-20 w-full bg-[#fafafa] shadow-[inset_0_8px_10px_-10px_rgba(0,0,0,0.55),0_12px_24px_rgba(0,0,0,0.12)]"
                        >
                            <div className="mx-auto max-w-[1320px] px-[25px] py-6">
                                <div className="grid w-[320px] gap-1 border-r border-zinc-200 pr-8">
                                    {departmentList.map((department) => (
                                        <a
                                            key={department.href}
                                            href={department.href}
                                            className="rounded-[8px] px-4 py-3 text-sm font-medium text-zinc-800 hover:bg-zinc-100"
                                        >
                                            {department.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                    </div>

                <div className="flex h-full items-center gap-16">
                    {optionList.map((option) => (
                        <a
                            key={option.href}
                            href={option.href}
                            className="relative flex h-full items-center text-base font-semibold text-zinc-950 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#D71920] after:opacity-0 after:transition-opacity after:duration-200 hover:after:opacity-100 focus-visible:after:opacity-100"
                        >
                            {option.label}
                        </a>
                    ))}
                    </div>
                </div>
            </nav>

            <nav className="border-t border-[#E8C600] bg-[#FFD900] lg:hidden">
                <div className="mx-auto max-w-[1320px] px-4 sm:px-[25px]">
                    <button
                        type="button"
                        aria-expanded={isMobileMenuOpen}
                        aria-controls="mobile-menu"
                        onClick={() => setIsMobileMenuOpen((currentState) => !currentState)}
                        className="flex h-12 w-full items-center justify-between text-sm font-semibold text-zinc-950"
                    >
                        <span className="flex items-center gap-2">
                            <Menu className="h-5 w-5" strokeWidth={2.2} />
                            Menu
                        </span>

                        {isMobileMenuOpen ? (
                            <X className="h-5 w-5" strokeWidth={2.2} />
                        ) : (
                            <span className="text-xs font-bold uppercase tracking-[0.08em] text-zinc-800">
                                Abrir
                            </span>
                        )}
                    </button>

                    {isMobileMenuOpen && (
                        <div id="mobile-menu" className="grid gap-4 pb-5">
                            <div>
                                <strong className="block border-b border-[#E8C600] pb-2 text-sm font-bold">
                                    Departamentos
                                </strong>

                                <div className="grid gap-1 pt-2">
                                    {departmentList.map((department) => (
                                        <a
                                            key={department.href}
                                            href={department.href}
                                            className="rounded-[8px] px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-[#E8C600]"
                                        >
                                            {department.label}
                                        </a>
                                    ))}
                                </div>
                            </div>

                            <div>
                                <strong className="block border-b border-[#E8C600] pb-2 text-sm font-bold">
                                    Navegação
                                </strong>

                                <div className="grid gap-1 pt-2">
                                    {optionList.map((option) => (
                                        <a
                                            key={option.href}
                                            href={option.href}
                                            className="rounded-[8px] px-3 py-2 text-sm font-medium text-zinc-900 hover:bg-[#E8C600]"
                                        >
                                            {option.label}
                                        </a>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </nav>
        </header> 
    );
}
