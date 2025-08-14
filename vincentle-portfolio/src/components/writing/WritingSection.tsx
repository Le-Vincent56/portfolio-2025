import { WritingMeta } from "@/lib/types";
import { useState } from "react";
import WritingCard from "@/components/writing/WritingCard";

export default function Writing({ writings }: { writings: WritingMeta[]}) {
    const [hoveredSlug, setHoveredSlug] = useState<string | null>(null);

    return (
        <section id="writing-section">
            <div className="flex items-end justify-between mb-4">
                <h2 className="text-3xl font-semibold">WRITING</h2>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
                {writings.map((p) => {
                    const isDimmed = !!hoveredSlug && hoveredSlug !== p.slug;
                    return (
                        <WritingCard
                            key={p.slug}
                            item={p}
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