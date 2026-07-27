import {
    Building2,
    CreditCard,
    Headphones,
    Heart,
    PackageCheck,
    ShieldCheck,
    Truck,
    UserRound,
    type LucideIcon,
} from "lucide-react";

export type AccountTypeId = "individual" | "company";

export type AccountType = {
    id: AccountTypeId;
    label: string;
    description: string;
    icon: LucideIcon;
};

export type SignupBenefit = {
    title: string;
    description: string;
    icon: LucideIcon;
};

export type SignupTrustItem = {
    title: string;
    description: string;
    icon: LucideIcon;
};

export const accountTypes: AccountType[] = [
    {
        id: "individual",
        label: "Pessoa Física",
        description: "Para compras pessoais",
        icon: UserRound,
    },
    {
        id: "company",
        label: "Pessoa Jurídica",
        description: "Para empresas e CNPJ",
        icon: Building2,
    },
];

export const signupBenefits: SignupBenefit[] = [
    {
        title: "Acompanhe seus pedidos",
        description: "Veja o status das suas compras em tempo real.",
        icon: PackageCheck,
    },
    {
        title: "Salve produtos favoritos",
        description: "Monte sua lista de desejos e compre quando quiser.",
        icon: Heart,
    },
    {
        title: "Checkout mais rápido",
        description: "Seus dados salvos para uma compra mais prática e segura.",
        icon: ShieldCheck,
    },
];

export const trustItems: SignupTrustItem[] = [
    {
        title: "Entrega rápida",
        description: "para toda a região",
        icon: Truck,
    },
    {
        title: "Parcele em até",
        description: "12x no cartão",
        icon: CreditCard,
    },
    {
        title: "Compre com",
        description: "segurança",
        icon: ShieldCheck,
    },
    {
        title: "Atendimento",
        description: "especializado",
        icon: Headphones,
    },
];
