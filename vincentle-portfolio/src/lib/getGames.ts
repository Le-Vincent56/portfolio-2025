import matter from 'gray-matter';
import { GamesMeta } from '@/lib/types';

import { readGame, listGames } from '@/lib/content';

function arrayify(v: unknown): string[] {
    if (Array.isArray(v)) return v.map(String);
    if (typeof v === 'string') return [v];
    return [];
}

export async function GetGames(): Promise<GamesMeta[]> {
    const slugs = await listGames();

    const items = await Promise.all(
        slugs.map(async (slug) => {
            const raw = await readGame(slug);
            const { data } = matter(raw);

            const title = (data.title as string) ?? slug;
            const roles = arrayify((data.roles ?? [data.primaryRole, data.secondaryRole]).filter(Boolean));
            const hook = (data.hook as string) ?? (data.description as string) ?? '';
            const cover =
                (data.cover as string) ||
                (data.image as string) ||
                `/images/projects/${slug}.jpg`; // fallback

            const order = typeof data.order === 'number' ? (data.order as number) : 999;

            const meta: GamesMeta = { slug, title, roles, hook, cover };
            return { meta, order };
        })
    );

    return items.sort((a, b) => a.order - b.order).map((x) => x.meta);
}
