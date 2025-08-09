import { readGames, listGames } from '@/lib/content';
import { compile } from '@/lib/mdx';
import StickySidebar from '@/components/game/StickySidebar';

export async function generateStaticParams() {
    const slugs = await listGames();
    return slugs.map(slug => ({ slug }));
}

export default async function ProjectPage({ params }: { params: { slug: string } }) {
    const source = await readGames(params.slug);
    const { content, frontmatter } = await compile(source);
    const sections = frontmatter.sections ?? ['overview'];

    return (
        <main className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
            <StickySidebar sections={sections} />
            <article className="prose prose-invert max-w-none">
                {content}
            </article>
        </main>
    )
}