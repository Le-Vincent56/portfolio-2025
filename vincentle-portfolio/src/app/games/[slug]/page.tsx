import { readGame, listGames } from '@/lib/content'
import { compile } from '@/lib/mdx'
import { notFound } from 'next/navigation'
import PageTransition from "@/components/ui/PageTransition";

export async function generateStaticParams() { return (await listGames()).map(slug => ({ slug })) }

export async function generateMetadata({ params }: { params: { slug:string } }) {
    try {
        const { frontmatter } = await compile(await readGame(params.slug))
        return { title: `${frontmatter.title} — Vincent Le`, description: frontmatter.hook }
    } catch { return { title: 'Project — Vincent Le' } }
}

export default async function ProjectPage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const source = await readGame(slug)
    const { content, frontmatter } = await compile(source)
    const sections = frontmatter.sections ?? ['overview']
    return (
        <PageTransition>
            <main className="mx-auto max-w-6xl px-6 py-12 grid grid-cols-1 lg:grid-cols-[220px_1fr] gap-8">
                <aside aria-label="Project sections" className="sticky top-24 h-fit hidden lg:block">
                    <nav className="text-sm space-y-2 text-text/70">
                        {sections.map(id => (
                            <a key={id} href={`#${id}`} className="block hover:text-text">{id}</a>
                        ))}
                    </nav>
                </aside>
                <article className="prose prose-invert max-w-none">{content}</article>
            </main>
        </PageTransition>
    )
}