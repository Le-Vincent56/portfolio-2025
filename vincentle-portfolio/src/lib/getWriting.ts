import matter from 'gray-matter';
import { WritingMeta } from '@/lib/types';
import { readWriting, listWriting } from '@/lib/content';
import { getReadingStats } from '@/lib/readingTime';

export async function GetWritings(): Promise<WritingMeta[]> {
    const slugs = await listWriting();

    const items = await Promise.all(
        slugs.map(async (slug) => {
            const raw = await readWriting(slug);
            const { data, content } = matter(raw);
            const stats = getReadingStats(content);

            const title = (data.title as string) ?? slug;
            const type = (data.type as string) ?? (data.category as string) ?? 'Article';
            const cover =
                (data.cover as string) ||
                (data.image as string) ||
                `/images/writing/${slug}.jpg`;

            const order = typeof data.order === 'number' ? (data.order as number) : 999;

            const meta: WritingMeta = { slug, title, type, cover, readingTimeText: stats.text };
            return { meta, order };
        })
    );

    return items.sort((a, b) => a.order - b.order).map((x) => x.meta);
}

export async function getRelatedByTags(
    currentSlug: string,
    tags: string[],
    limit = 3
): Promise<{ slug: string; title: string; cover?: string }[]> {
    if (!tags || tags.length === 0) return [];
    const slugs = await listWriting();
    const candidates = slugs.filter((s) => s !== currentSlug);

    const scored = await Promise.all(
        candidates.map(async (slug) => {
            const raw = await readWriting(slug);
            const { data } = matter(raw);
            const pieceTags = ((data.tags as string[] | undefined) ?? []).map((t) => t.toLowerCase());
            const overlap = pieceTags.filter((t) => tags.map((x) => x.toLowerCase()).includes(t)).length;
            const title = (data.title as string) ?? slug;
            const cover = (data.cover as string) || (data.image as string) || `/images/writing/${slug}.jpg`;
            return { slug, title, cover, score: overlap };
        })
    );

    return scored
        .filter((x) => x.score > 0)
        .sort((a, b) => b.score - a.score)
        .slice(0, limit)
        .map(({ slug, title, cover }) => ({ slug, title, cover }));
}