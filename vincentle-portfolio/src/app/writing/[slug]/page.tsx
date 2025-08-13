import {readWriting, listWriting, readGame} from '@/lib/content'
import { compile } from '@/lib/mdx'
import { getReadingStats } from '@/lib/readingTime'
import PageTransition from "@/components/ui/PageTransition";
import {notFound} from "next/navigation";

export async function generateStaticParams() { return (await listWriting()).map(slug => ({ slug })) }

export default async function WritingPage({ params }: { params: { slug: string } }) {
    try {
        const source = await readWriting(params.slug)
        const { content, frontmatter } = await compile(source)
        const stats = getReadingStats(source)
        return (
            <PageTransition>
                <main className="mx-auto max-w-3xl px-6 py-12">
                    <header className="mb-8">
                        <h1 className="text-3xl font-semibold">{frontmatter.title}</h1>
                        <div className="text-sm text-text/60">{Math.ceil(stats.minutes)} min read</div>
                    </header>
                    <article className="prose prose-invert max-w-none">{content}</article>
                </main>
            </PageTransition>
        );
    } catch {
        notFound()
    }
}