import {
    FilePenLine,
    Headphones,
    Heart,
    KeyRound,
    MapPin,
    PackageSearch,
    type LucideIcon,
} from "lucide-react";

export type AccountAction = {
    title: string;
    description: string;
    icon: LucideIcon;
    href?: string;
    status?: string;
};

export const accountActions: AccountAction[] = [
    {
        title: "Meus pedidos",
        description: "Acompanhamento de compras e histórico.",
        icon: PackageSearch,
        href: "/account/orders",
        status: "Em breve",
    },
    {
        title: "Favoritos",
        description: "Produtos salvos para comprar depois.",
        icon: Heart,
        href: "/favorites",
    },
    {
        title: "Endereços",
        description: "Adicionar ou editar locais de entrega.",
        icon: MapPin,
        status: "Em breve",
    },
    {
        title: "Atendimento",
        description: "Suporte, dúvidas e canais de contato.",
        icon: Headphones,
        href: "/support",
        status: "Em breve",
    },
];

export const securityActions: AccountAction[] = [
    {
        title: "Senha e segurança",
        description: "Atualização de senha e proteção do acesso.",
        icon: KeyRound,
    },
];

export const profileActions: AccountAction[] = [
    {
        title: "Editar dados",
        description: "Atualize nome, telefone e informações cadastrais.",
        icon: FilePenLine,
    },
];
