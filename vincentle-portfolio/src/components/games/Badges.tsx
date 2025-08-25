import { ReactNode } from "react";

export function Pill({ children }: { children: ReactNode }) {
    return (
        <span className="inline-flex items-center rounded-full border border-white/10 bg-white/5 px-2.5 py-1 text-xs text-white/80 backdrop-blur-sm">
            {children}
        </span>
    );
}


export function BadgeRow({ items }: { items: string[] }) {
    if (!items?.length) return null;
    return (
        <div className="flex flex-wrap gap-2">
            {items.map((t) => (
                <Pill key={t}>{t}</Pill>
            ))}
        </div>
    );
}