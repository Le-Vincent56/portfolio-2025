'use client';

import {GamesMeta} from "@/lib/types";
import GameCard from "@/components/games/GameCard";
import {useState, useEffect, useCallback, useRef} from "react";
import {usePathname} from "next/navigation";

export default function GamesSection({ games }: { games: GamesMeta[]}) {
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
    const pathname = usePathname();
    const sectionRef = useRef<HTMLElement>(null);

    const resetHover = useCallback(() => {
        setHoveredSlug(null);
        // Also blur any focused element within the section
        if (document.activeElement instanceof HTMLElement) {
            const section = sectionRef.current;
            if (section?.contains(document.activeElement)) {
                document.activeElement.blur();
            }
        }
    }, []);

    // Reset hover state when pathname changes (returning to home page)
    useEffect(() => {
        resetHover();
    }, [pathname, resetHover]);

    // Also reset on popstate and pageshow for bfcache scenarios
    useEffect(() => {
        const handlePageShow = (e: PageTransitionEvent) => {
            if (e.persisted) resetHover();
        };

        window.addEventListener('pageshow', handlePageShow);
        window.addEventListener('popstate', resetHover);

        return () => {
            window.removeEventListener('pageshow', handlePageShow);
            window.removeEventListener('popstate', resetHover);
        };
    }, [resetHover]);
    
    return (
        <section id="games" ref={sectionRef}>
            <div className="flex items-end justify-between mb-4">
                <h2 className="text-3xl font-semibold">GAMES</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {games.map((p) => {
                    const isDimmed = !!hoveredSlug && hoveredSlug !== p.slug;
                    return (
                        <GameCard
                            key={p.slug}
                            project={p}
                            isDimmed={isDimmed}
                            onHoverStartAction={() => setHoveredSlug(p.slug)}
                            onHoverEndAction={() => setHoveredSlug(null)}
                            onFocusAction={() => setHoveredSlug(p.slug)}
                            onBlurAction={() => setHoveredSlug(null)}
                        />
                    );
                })}
            </div>
        </section>
    )
}