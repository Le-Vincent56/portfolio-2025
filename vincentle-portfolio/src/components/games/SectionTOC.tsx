"use client";

import { useEffect, useRef, useState } from "react";

type Props = { ids: string[]; offsetPx?: number };
type HeadingRef = { id: string; el: HTMLElement; top: number };

function titleCaseFromKebab(id: string) {
    return id.split("-").map(w => w[0].toUpperCase() + w.slice(1)).join(" ");
}

export default function SectionTOC({ ids, offsetPx = 96 }: Props) {
    const [active, setActive] = useState<string | null>(ids[0] ?? null);
    const headsRef = useRef<HeadingRef[]>([]);
    const rafLock = useRef(false);
    const scrollLockUntil = useRef(0);

    // Map provided ids -> actual H2 elements (ignore H3 subheaders)
    const ensureHeadingIds = () => {
        if (typeof window === "undefined") return;

        const article = document.querySelector<HTMLElement>("article.game-article");
        if (!article) return;

        // Only top-level H2s (or their wrappers) under the article
        const starts = Array.from(
            article.querySelectorAll<HTMLElement>(":scope > .reader-h2-wrap, :scope > h2")
        );

        // Extract the actual <h2> to anchor
        const h2Els: HTMLElement[] = starts.map(node => {
            if (node.matches(".reader-h2-wrap")) {
                const h = node.querySelector<HTMLElement>("h2");
                return h ?? (node as HTMLElement);
            }
            return node as HTMLElement;
        }).filter(Boolean);

        const count = Math.min(ids.length, h2Els.length);
        for (let i = 0; i < count; i++) {
            const h = h2Els[i];
            if (h.id !== ids[i]) h.id = ids[i]; // force exact ids so links work
        }

        headsRef.current = ids
            .map(id => {
                const el = article.querySelector<HTMLElement>(`#${CSS.escape(id)}`);
                return el ? { id, el, top: 0 } : null;
            })
            .filter(Boolean) as HeadingRef[];
    };

    // Measure with padding compensation so "top of section" = where the text starts
    const measure = () => {
        if (typeof window === "undefined") return;
        headsRef.current.forEach(h => {
            const rectTop = h.el.getBoundingClientRect().top + window.scrollY;
            const padTop = parseFloat(getComputedStyle(h.el).paddingTop || "0") || 0;
            h.top = rectTop + padTop; // ignore inter-section padding area
        });
        headsRef.current.sort((a, b) => a.top - b.top);
    };

    const pickActive = () => {
        if (typeof window === "undefined") return;
        if (Date.now() < scrollLockUntil.current) return;
        const list = headsRef.current;
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
        ensureHeadingIds();
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

        const imgs = Array.from(document.images);
        const onImgLoad = () => { measure(); pickActive(); };
        imgs.forEach(img => img.addEventListener("load", onImgLoad, { once: true }));

        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onResize);
            imgs.forEach(img => img.removeEventListener("load", onImgLoad));
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ids, offsetPx]);

    const onNavClick = (e: React.MouseEvent, id: string) => {
        e.preventDefault();
        const target = headsRef.current.find(h => h.id === id)?.el;
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
                                <span className={`h-px w-4 transition-all ${isActive ? "bg-[var(--color-primary)] w-6" : "bg-white/10"}`} aria-hidden />
                                <span className={isActive ? "text-white" : undefined}>{titleCaseFromKebab(id)}</span>
                            </a>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}