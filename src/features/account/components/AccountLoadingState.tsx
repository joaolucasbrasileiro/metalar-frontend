export function AccountLoadingState() {
    return (
        <section className="rounded-[8px] border border-zinc-200 bg-white p-8 shadow-sm">
            <div className="h-6 w-44 rounded bg-zinc-100" />
            <div className="mt-4 h-10 max-w-lg rounded bg-zinc-100" />
            <div className="mt-8 grid gap-4 lg:grid-cols-3">
                <div className="h-44 rounded-[8px] bg-zinc-100" />
                <div className="h-44 rounded-[8px] bg-zinc-100" />
                <div className="h-44 rounded-[8px] bg-zinc-100" />
            </div>
        </section>
    );
}
