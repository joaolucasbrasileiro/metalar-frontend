"use client";
import { useState } from "react";

import Image from "next/image";
import { Search, Heart, UserRound, ShoppingCart, Menu, } from "lucide-react";

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

export function HomeHeader() {
    const [isDepartmentsHovered, setIsDepartmentsHovered] = useState(false);
    const [isDepartmentsPinned, setIsDepartmentsPinned] = useState(false);

    const isDepartmentsOpen = isDepartmentsHovered || isDepartmentsPinned;

    return (
        <header className="bg-[#FFD900] text-zinc-950">
            <div className="mx-auto flex max-w-[1320px] gap-10 px-[25px] py-4">
                <Image 
                src="/logo.svg" 
                alt="Metalar" 
                width={120} height={48} 
                priority
                className="-mt-3"
            />

            <div className="relative flex flex-1">
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
            <div className="flex items-center gap-3 text-zinc-950">
                <a
                href="#"
                aria-label="Favoritos"
                className="grid h-12 w-12 place-items-center rounded-full transition-colors duration-200 hover:bg-[#E8C600]">
                    <Heart className="h-7 w-7" strokeWidth={1.7}/>
                </a>
                <a
                href="#"
                aria-label="Minha conta"
                className="grid h-12 w-12 place-items-center rounded-full transition-colors duration-200 hover:bg-[#E8C600]">
                    <UserRound className="h-7 w-7" strokeWidth={1.7}/>
                </a>
                <a
                href="#"
                aria-label="Carrinho"
                className="grid h-12 w-12 place-items-center rounded-full transition-colors duration-200 hover:bg-[#E8C600]">
                    <ShoppingCart className="h-7 w-7" strokeWidth={1.7}/>
                </a>
            </div>

            </div>
            <nav className="relative bg-[#FFD900]">
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
                    font-medium
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
                        className="absolute left-0 top-full z-20 w-full bg-white shadow-[inset_0_8px_10px_-10px_rgba(0,0,0,0.55),0_12px_24px_rgba(0,0,0,0.12)]"
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
                            className="relative flex h-full items-center text-base font-medium text-zinc-950 after:absolute after:bottom-0 after:left-0 after:h-[3px] after:w-full after:rounded-full after:bg-[#D71920] after:opacity-0 after:transition-opacity after:duration-200 hover:after:opacity-100 focus-visible:after:opacity-100"
                        >
                            {option.label}
                        </a>
                    ))}
                    </div>
                </div>
            </nav>
        </header> 
    );
}
