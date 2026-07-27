import { trustItems } from "../data";

export function SignupTrustBar() {
    return (
        <section className="mt-5 grid rounded-[8px] border border-zinc-200 bg-white shadow-sm sm:grid-cols-2 lg:grid-cols-4">
            {trustItems.map((item, index) => {
                const Icon = item.icon;

                return (
                    <div
                        key={item.title}
                        className={`flex items-center gap-4 px-8 py-6 ${
                            index > 0 ? "lg:border-l lg:border-zinc-200" : ""
                        }`}
                    >
                        <Icon
                            className="h-8 w-8 shrink-0 text-zinc-950"
                            strokeWidth={2.2}
                        />
                        <span>
                            <strong className="block text-sm font-extrabold">
                                {item.title}
                            </strong>
                            <span className="block text-sm font-semibold text-zinc-700">
                                {item.description}
                            </span>
                        </span>
                    </div>
                );
            })}
        </section>
    );
}
