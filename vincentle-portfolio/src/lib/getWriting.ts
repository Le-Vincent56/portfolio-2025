import matter from 'gray-matter';
import { WritingMeta } from '@/lib/types';
import { readWriting, listWriting } from '@/lib/content';

export async function GetWritings(): Promise<WritingMeta[]> {
    const slugs = await listWriting();

    const items = await Promise.all(
        slugs.map(async (slug) => {
            const raw = await readWriting(slug);
            const { data } = matter(raw);

            const title = (data.title as string) ?? slug;
            const type = (data.type as string) ?? (data.category as string) ?? 'Article';
            const cover =
                (data.cover as string) ||
                (data.image as string) ||
                `/images/writing/${slug}.jpg`;

            const order = typeof data.order === 'number' ? (data.order as number) : 999;

            const meta: WritingMeta = { slug, title, type, cover };
            return { meta, order };
        })
    );

    return items.sort((a, b) => a.order - b.order).map((x) => x.meta);
}
