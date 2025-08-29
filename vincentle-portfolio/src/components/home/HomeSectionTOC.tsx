"use client";

import { useEffect, useRef, useState } from "react";

type Props = {
    ids?: string[];      // defaults to the 4 home sections
    offsetPx?: number;   // how much to offset when scrolling (desktop header, etc.)
};

type SectionRef = { 
    id: string; 
    el: HTMLElement; 
    top: number 
};

function titleCaseFromKebab(id: string) {
    return id.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default function HomeSectionTOC({
    ids = ["about", "games", "audio", "writing"],
    offsetPx = 96,
}: Props) {
    const [active, setActive] = useState<string | null>(ids[0] ?? null);
    const secsRef = useRef<SectionRef[]>([]);
    const rafLock = useRef(false);
    const scrollLockUntil = useRef(0);

    const measure = () => {
        if (typeof window === "undefined") return;
        secsRef.current.forEach(s => {
            const rectTop = s.el.getBoundingClientRect().top + window.scrollY;
            const padTop = parseFloat(getComputedStyle(s.el).paddingTop || "0") || 0;
            s.top = rectTop + padTop;
        });
        secsRef.current.sort((a, b) => a.top - b.top);
    };

    const pickActive = () => {
        if (typeof window === "undefined") return;
        if (Date.now() < scrollLockUntil.current) return;
        const list = secsRef.current;
        if (!list.length) return;

        const doc = (document.scrollingElement || document.documentElement) as HTMLElement;
        const scrollTop = doc.scrollTop;
        const scrollHeight = doc.scrollHeight;
        const y = scrollTop + offsetPx + 1;

        const atBottom = Math.ceil(scrollTop + window.innerHeight) >= scrollHeight - 1;
        const last = list[list.length - 1];

        if (atBottom || y >= last.top - 8) {
            setActive(last.id);
            return;
        }

        let current = list[0].id;
        for (let i = 0; i < list.length; i++) {
            if (list[i].top <= y) current = list[i].id;
            else break;
        }
        setActive(current);
    };

    useEffect(() => {
        // resolve section elements by id
        secsRef.current = ids
            .map(id => {
                const el = document.getElementById(id);
                return el ? { id, el, top: 0 } : null;
            })
            .filter(Boolean) as SectionRef[];

        measure();
        pickActive();

        const onScroll = () => {
            if (rafLock.current) return;
            rafLock.current = true;
            requestAnimationFrame(() => {
                pickActive();
                rafLock.current = false;
            });
        };
        const onResize = () => { measure(); pickActive(); };

        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onResize);

        // re-measure when images load (helps when sections shift)
        const imgs = Array.from(document.images);
        const onImgLoad = () => { measure(); pickActive(); };
        imgs.forEach(img => img.addEventListener("load", onImgLoad, { once: true }));

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            imgs.forEach(img => img.removeEventListener("load", onImgLoad));
        };
    }, [ids, offsetPx]);

    const onNavClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const target = secsRef.current.find(s => s.id === id)?.el;
        if (!target) return;

        const padTop = parseFloat(getComputedStyle(target).paddingTop || "0") || 0;
        const top = target.getBoundingClientRect().top + window.scrollY - (offsetPx + padTop);
        scrollLockUntil.current = Date.now() + 500;

        const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        window.scrollTo({ top, behavior: reduced ? "auto" : "smooth" });
        setActive(id);
    };

    return (
        <nav aria-label="On this page" className="text-sm">
            <ul className="space-y-1.5 border-l border-white/10 pl-3">
                {ids.map(id => {
                    const isActive = active === id;
                    return (
                        <li key={id}>
                            <a
                                href={`#${id}`}
                                onClick={(e) => onNavClick(e, id)}
                                aria-current={isActive ? "true" : undefined}
                                className="group flex items-center gap-2 text-white/60 hover:text-white transition-colors"
                            >
                <span
                    className={`h-px w-4 transition-all ${isActive ? "bg-[var(--color-primary)] w-6" : "bg-white/10"}`}
                    aria-hidden
                />
                                <span className={isActive ? "text-white" : undefined}>
                  {titleCaseFromKebab(id)}
                </span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}