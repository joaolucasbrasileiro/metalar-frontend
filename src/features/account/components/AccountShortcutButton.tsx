import { ChevronRight, type LucideIcon } from "lucide-react";

type AccountShortcutButtonProps = {
    title: string;
    description: string;
    icon: LucideIcon;
    tone?: "brand" | "soft";
    isActive?: boolean;
    onClick: () => void;
};

export function AccountShortcutButton({
    title,
    description,
    icon: Icon,
    tone = "brand",
    isActive = false,
    onClick,
}: AccountShortcutButtonProps) {
    const iconClassName = tone === "brand" ? "bg-[#FFD900]" : "bg-[#fff3b8]";

    return (
        <button
            type="button"
            aria-current={isActive ? "page" : undefined}
            onClick={onClick}
            className={`group flex w-full items-center gap-3 rounded-[8px] border p-4 text-left transition-all hover:-translate-y-0.5 hover:border-[#f2c500] hover:bg-white hover:shadow-sm ${
                isActive
                    ? "border-[#f2c500] bg-[#fff8d9]"
                    : "border-zinc-200 bg-zinc-50"
            }`}
        >
            <span className={`grid h-10 w-10 shrink-0 place-items-center rounded-[6px] text-zinc-950 ${iconClassName}`}>
                <Icon className="h-5 w-5" strokeWidth={2.2} />
            </span>

            <span className="min-w-0 flex-1">
                <strong className="block text-sm font-extrabold text-zinc-950">
                    {title}
                </strong>
                <span className="mt-1 block text-sm font-medium leading-relaxed text-zinc-600">
                    {description}
                </span>
            </span>

            <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full border border-zinc-200 bg-white text-zinc-950 transition-colors group-hover:border-[#f2c500] group-hover:bg-[#FFD900]">
                <ChevronRight className="h-4 w-4" strokeWidth={2.4} />
            </span>
        </button>
    );
}
