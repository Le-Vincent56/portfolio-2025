import { readWriting, listWriting } from '@/lib/content';
import { compile } from '@/lib/mdx';
import { getReadingStats } from '@/lib/readingTime';
import PageTransition from '@/components/ui/PageTransition';

export async function generateStaticParams() {
    return (await listWriting()).map(slug => ({ slug }));
}

export default async function WritingPage(
    { params }: { params: Promise<{ slug: string }> } // Next 15 dynamic API is async
) {
    const { slug } = await params;

    const source = await readWriting(slug);
    const { content, frontmatter } = await compile(source);
    const stats = getReadingStats(source);

    return (
        <PageTransition>
            <main className="mx-auto max-w-5xl px-6 py-12 bg-background">
                <header className="mb-6">
                    <h1 className="text-3xl font-semibold">{frontmatter.title}</h1>
                    <div className="text-sm text-text/60">{Math.ceil(stats.minutes)} min read</div>
                </header>
                <article>{content}</article>
            </main>
        </PageTransition>
    );
}