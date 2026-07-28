import { securityActions } from "../data";
import { AccountShortcutButton } from "./AccountShortcutButton";

type AccountSecurityPanelProps = {
    isSecurityActive: boolean;
    onEditSecurity: () => void;
};

export function AccountSecurityPanel({
    isSecurityActive,
    onEditSecurity,
}: AccountSecurityPanelProps) {
    return (
        <section className="rounded-[8px] border border-zinc-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-extrabold text-zinc-950">Segurança da conta</h2>
            <p className="mt-1 text-sm font-semibold text-zinc-600">
                Acesso, sessão e proteção da sua conta.
            </p>

            <div className="mt-5 grid gap-3">
                {securityActions.map((action) => {
                    return (
                        <AccountShortcutButton
                            key={action.title}
                            title={action.title}
                            description={action.description}
                            icon={action.icon}
                            tone="soft"
                            isActive={isSecurityActive}
                            onClick={onEditSecurity}
                        />
                    );
                })}
            </div>
        </section>
    );
}
