import { ResetPasswordPage } from "@/features/password-recovery/ResetPasswordPage";

type PageProps = {
    searchParams: Promise<{
        email?: string | string[];
        token?: string | string[];
    }>;
};

function firstParam(value?: string | string[]) {
    return Array.isArray(value) ? value[0] : value;
}

export default async function Page({ searchParams }: PageProps) {
    const params = await searchParams;

    return (
        <ResetPasswordPage
            email={firstParam(params.email)}
            token={firstParam(params.token)}
        />
    );
}
