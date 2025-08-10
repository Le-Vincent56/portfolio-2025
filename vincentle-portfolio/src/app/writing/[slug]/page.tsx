import { readWriting, listWriting } from '@/lib/content'
import { compile } from '@/lib/mdx'
import { getReadingStats } from '@/lib/readingTime'
import PageTransition from "@/components/ui/PageTransition";

export async function generateStaticParams() { return (await listWriting()).map(slug => ({ slug })) }

export default async function WritingPage({ params }: { params: { slug: string } }) {
    const raw = await readWriting(params.slug)
    const { content, frontmatter } = await compile(raw)
    const stats = getReadingStats(raw)
    return (
        <PageTransition>
            <main className="mx-auto max-w-3xl px-6 py-12">
                <header className="mb-8">
                    <h1 className="text-3xl font-semibold">{frontmatter.title}</h1>
                    <div className="text-sm text-white/60">{Math.ceil(stats.minutes)} min read</div>
                </header>
                <article className="prose prose-invert max-w-none">{content}</article>
            </main>
        </PageTransition>
    )
}