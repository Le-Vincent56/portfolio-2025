"use client";
import { useRef, useState } from "react";
import { Lightbox } from "./Lightbox";

type MediaItem = { src: string; type: "image" | "gif" | "video"; caption?: string };

export default function MediaRail({ items }: { items: MediaItem[] }) {
    const ref = useRef<HTMLDivElement>(null);
    const [lightbox, setLightbox] = useState<string | null>(null);

    const onKey = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (!ref.current) return;
        const el = ref.current;
        if (e.key === "ArrowRight") el.scrollBy({ left: el.clientWidth * 0.9, behavior: "smooth" });
        if (e.key === "ArrowLeft") el.scrollBy({ left: -el.clientWidth * 0.9, behavior: "smooth" });
    };

    let startX = 0;
    const onTouchStart = (e: React.TouchEvent) => (startX = e.touches[0].clientX);
    const onTouchEnd = (e: React.TouchEvent) => {
        const dx = e.changedTouches[0].clientX - startX;
        if (Math.abs(dx) > 48 && ref.current) {
            ref.current.scrollBy({ left: -dx, behavior: "smooth" });
        }
    };

    return (
        <div className="space-y-2">
            <div
                ref={ref}
                tabIndex={0}
                onKeyDown={onKey}
                onTouchStart={onTouchStart}
                onTouchEnd={onTouchEnd}
                className="flex gap-4 overflow-x-auto scroll-smooth snap-x snap-mandatory px-1 py-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
                aria-label="Media gallery"
            >
                {items.map((it, i) => (
                    <figure key={i} className="snap-start shrink-0 w-[min(560px,85vw)]">
                        {it.type === "video" ? (
                            <video controls className="w-full rounded-xl border border-white/10 shadow-lg">
                                <source src={it.src} />
                            </video>
                        ) : (
                            <button onClick={() => setLightbox(it.src)} className="block w-full">
                                <img src={it.src} alt={it.caption ?? ""} className="w-full rounded-xl border border-white/10 shadow-lg hover:brightness-110" />
                            </button>
                        )}
                        {it.caption && (
                            <figcaption className="mt-2 text-center text-xs text-white/60">{it.caption}</figcaption>
                        )}
                    </figure>
                ))}
            </div>
            <p className="text-xs text-text/50">Tip: Use
                <kbd className="mx-1 rounded bg-white/10 px-1.5 py-0.5">←</kbd>
                <kbd className="rounded bg-white/10 px-1.5 py-0.5">→</kbd> to navigate.
            </p>
            {lightbox && <Lightbox src={lightbox} onClose={() => setLightbox(null)} />}
        </div>
    );
}