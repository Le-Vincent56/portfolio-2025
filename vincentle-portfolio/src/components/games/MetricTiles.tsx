export default function MetricTiles({ items }: { items: { label: string; value: string }[] }) {
    if (!items?.length) return null;
    return (
        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
            {items.map((m) => (
                <div key={m.label} className="rounded-xl border border-white/10 bg-white/5 p-3">
                    <div className="text-[10px] uppercase tracking-wide text-text/50">{m.label}</div>
                    <div className="text-sm text-text/90">{m.value}</div>
                </div>
            ))}
        </div>
    );
}