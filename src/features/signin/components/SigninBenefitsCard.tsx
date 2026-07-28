import { signinBenefits } from "../data";

export function SigninBenefitsCard() {
    return (
        <div className="absolute bottom-8 left-8 right-8 rounded-[8px] border border-zinc-200 bg-white/95 p-6 shadow-sm backdrop-blur">
            <div className="grid grid-cols-3">
                {signinBenefits.map((benefit, index) => {
                    const Icon = benefit.icon;

                    return (
                        <div
                            key={benefit.title}
                            className={`px-6 ${index > 0 ? "border-l border-zinc-200" : ""}`}
                        >
                            <span className="grid h-11 w-11 place-items-center rounded-[6px] bg-[#fff3b8] text-zinc-950">
                                <Icon className="h-6 w-6" strokeWidth={2.2} />
                            </span>
                            <strong className="mt-4 block text-sm font-extrabold">
                                {benefit.title}
                            </strong>
                            <span className="mt-1 block text-xs font-medium leading-relaxed text-zinc-600">
                                {benefit.description}
                            </span>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
