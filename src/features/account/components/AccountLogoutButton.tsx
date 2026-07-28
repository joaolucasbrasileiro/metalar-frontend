import { LogOut } from "lucide-react";

type AccountLogoutButtonProps = {
    isSigningOut: boolean;
    onLogout: () => void;
};

export function AccountLogoutButton({
    isSigningOut,
    onLogout,
}: AccountLogoutButtonProps) {
    return (
        <button
            type="button"
            disabled={isSigningOut}
            onClick={onLogout}
            className="flex h-12 items-center justify-center gap-2 rounded-[6px] border border-zinc-300 bg-white px-5 text-sm font-extrabold text-zinc-950 shadow-sm transition-colors hover:border-zinc-400 hover:bg-zinc-50 disabled:cursor-not-allowed disabled:opacity-70"
        >
            <LogOut className="h-5 w-5" strokeWidth={2.2} />
            {isSigningOut ? "Saindo..." : "Sair da conta"}
        </button>
    );
}
