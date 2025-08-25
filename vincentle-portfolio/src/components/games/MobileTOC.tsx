"use client";
import { useEffect, useRef, useState } from "react";

function titleCaseFromKebab(id: string) {
    return id
        .split("-")
        .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
        .join(" ");
}

export default function MobileTOC({ ids }: { ids: string[] }) {
    const [open, setOpen] = useState(false);
    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, []);

    useEffect(() => {
        if (!open) return;
        const first = panelRef.current?.querySelector<HTMLElement>("a, button");
        first?.focus();
    }, [open]);

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="lg:hidden fixed bottom-5 right-5 z-40 rounded-full bg-white/10 backdrop-blur-md px-4 py-2 text-sm text-white shadow-lg border border-white/15"
                aria-label="Open on‑page navigation"
            >
                Contents
            </button>
            {open && (
                <div
                    className="fixed inset-0 z-50"
                    role="dialog"
                    aria-modal="true"
                    onClick={() => setOpen(false)}
                >
                    <div className="absolute inset-0 bg-background/60" />
                    <div
                        ref={panelRef}
                        className="absolute bottom-0 inset-x-0 rounded-t-2xl bg-background border-t border-white/10 p-4 pb-8"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="mx-auto h-1 w-10 rounded-full bg-white/20 mb-4" aria-hidden />
                        <nav aria-label="On this page">
                            <ul className="grid grid-cols-1 gap-2">
                                {ids.map((id) => (
                                    <li key={id}>
                                        <a
                                            href={`#${id}`}
                                            onClick={() => setOpen(false)}
                                            className="block rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-white/80"
                                        >
                                            {titleCaseFromKebab(id)}
                                        </a>
                                    </li>
                                ))}
                            </ul>
                        </nav>
                    </div>
                </div>
            )}
        </>
    );
}