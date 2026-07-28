import { Clock3, ShieldCheck, Tags, type LucideIcon } from "lucide-react";

export type SigninBenefit = {
    title: string;
    description: string;
    icon: LucideIcon;
};

export const signinBenefits: SigninBenefit[] = [
    {
        title: "Acesso seguro",
        description: "Seus dados protegidos com criptografia de ponta.",
        icon: ShieldCheck,
    },
    {
        title: "Histórico de pedidos",
        description: "Acompanhe seus pedidos e compras anteriores.",
        icon: Clock3,
    },
    {
        title: "Ofertas exclusivas",
        description: "Aproveite descontos e promoções especiais.",
        icon: Tags,
    },
];
