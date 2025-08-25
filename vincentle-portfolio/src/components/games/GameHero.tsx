import Image from "next/image";
import { BadgeRow } from "@/components/games/Badges";
import MetricTiles from "@/components/games/MetricTiles";
import {GameFrontmatter} from "@/lib/types";


export default function GameHero({ fm }: { fm: GameFrontmatter }) {
    const facts = [fm.engine, fm.platform, fm.duration].filter(Boolean) as string[];
    const metrics = [
        fm.roles?.length ? { label: "Roles", value: fm.roles!.join(", ") } : null,
        fm.status ? { label: "Status", value: fm.status } : null,
    ].filter(Boolean) as { label: string; value: string }[];

    return (
        <header className="relative overflow-hidden rounded-2xl border border-background-accent/50 bg-background-accent/50 p-4 sm:p-6">
            {fm.cover && (
                <div className="relative aspect-[16/9] w-full overflow-hidden rounded-xl ring-1 ring-white/10">
                    <Image
                        src={fm.cover}
                        alt=""
                        fill
                        className="object-cover transition-transform duration-300 ease-in-out will-change-transform group-hover:scale-[1.02]"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 80vw, 1024px"
                        priority
                    />
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 to-transparent" />
                </div>
            )}

            <div className="mt-4 flex flex-col gap-3">
                <h1 className="text-text text-2xl font-semibold">{fm.title}</h1>
                {fm.hook && <p className="text-sm text-text/70">{fm.hook}</p>}
                <BadgeRow items={facts} />
                {!!metrics.length && <MetricTiles items={metrics} />}
                {fm.highlights?.length ? (
                    <ul className="mt-2 grid gap-2 sm:grid-cols-3">
                        {fm.highlights.map((h) => (
                            <li key={h} className="rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-text/80">{h}</li>
                        ))}
                    </ul>
                ) : null}
            </div>
        </header>
    );
}