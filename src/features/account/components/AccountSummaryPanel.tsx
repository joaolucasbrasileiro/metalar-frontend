import { profileActions } from "../data";
import type { AccountUser } from "./AccountDashboard";
import { AccountShortcutButton } from "./AccountShortcutButton";

type AccountSummaryPanelProps = {
    user: AccountUser;
    isProfileActive: boolean;
    onEditProfile: () => void;
};

const emptyValue = "Não informado";

export function AccountSummaryPanel({
    user,
    isProfileActive,
    onEditProfile,
}: AccountSummaryPanelProps) {
    const profileItems = [
        { label: "Nome", value: user.name },
        { label: "E-mail", value: user.email },
        { label: "Telefone", value: user.phone || emptyValue },
        { label: "CPF", value: user.cpf || emptyValue },
        { label: "Perfil", value: user.role || emptyValue },
        { label: "Cliente desde", value: user.created_at || emptyValue },
    ];

    return (
        <section className="rounded-[8px] border border-zinc-200 bg-white p-6 shadow-sm">
            <div className="flex items-start justify-between gap-4">
                <div>
                    <h2 className="text-lg font-extrabold text-zinc-950">Resumo da conta</h2>
                    <p className="mt-1 text-sm font-semibold text-zinc-600">
                        Dados cadastrais principais.
                    </p>
                </div>
            </div>

            <dl className="mt-5 grid gap-4">
                {profileItems.map((item) => (
                    <div key={item.label} className="grid gap-1">
                        <dt className="text-xs font-extrabold uppercase text-zinc-500">
                            {item.label}
                        </dt>
                        <dd className="text-sm font-bold text-zinc-900">
                            {item.value}
                        </dd>
                    </div>
                ))}
            </dl>

            <div className="mt-6 grid gap-3">
                {profileActions.map((action) => {
                    return (
                        <AccountShortcutButton
                            key={action.title}
                            title={action.title}
                            description={action.description}
                            icon={action.icon}
                            isActive={isProfileActive}
                            onClick={onEditProfile}
                        />
                    );
                })}
            </div>
        </section>
    );
}
