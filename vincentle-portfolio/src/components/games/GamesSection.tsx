import {GamesMeta} from "@/lib/types";
import GameCard from "@/components/games/GameCard";
import {useState} from "react";

export default function GamesSection({ games }: { games: GamesMeta[]}) {
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);
    
    return (
        <section id="games">
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