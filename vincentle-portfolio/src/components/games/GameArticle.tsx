// app/(...)/_components/GameArticle.tsx
"use client";

import { useEffect, useRef } from "react";

function isSectionStart(el: Element) {
    if (!(el instanceof HTMLElement)) return false;
    if (el.matches(".reader-h2-wrap")) return true;         // your wrapper
    const tag = el.tagName;
    return tag === "H2" || tag === "H3";                    // fallback if any raw heads exist
}

function sectionize(root: HTMLElement) {
    if (!root || root.querySelector(".mdx-section")) return; // already done

    // Work with a live view of direct children
    let node: Element | null = root.firstElementChild;

    while (node) {
        if (!isSectionStart(node)) {
            node = node.nextElementSibling;
            continue;
        }

        // Make a wrapper just before the current start node
        const wrap = document.createElement("section");
        wrap.className = "mdx-section";
        root.insertBefore(wrap, node);

        // Move the section-start node inside
        wrap.appendChild(node);

        // Then move *following siblings* until we hit the next section-start or the end
        while (wrap.nextElementSibling && !isSectionStart(wrap.nextElementSibling)) {
            wrap.appendChild(wrap.nextElementSibling);
        }

        // Continue from whatever now follows the wrapper (the next start or null)
        node = wrap.nextElementSibling;
    }
}

export default function GameArticle({ children }: { children: React.ReactNode }) {
    const ref = useRef<HTMLElement>(null);

    useEffect(() => {
        if (ref.current) sectionize(ref.current);
    }, []);

    return (
        <article ref={ref} className="prose prose-invert game-article max-w-none">
            {children}
        </article>
    );
}