import Image from 'next/image';
import PageTransition from '@/components/ui/PageTransition';
import { readWriting, listWriting } from '@/lib/content';
import { compile } from '@/lib/mdx';
import { getReadingStats } from '@/lib/readingTime';
import { getRelatedByTags } from '@/lib/getWriting';

import ReaderModePill from '@/components/writing/ReaderModePill';
import ReadingProgress from '@/components/writing/ReadingProgress';
import StickyBack from '@/components/writing/StickyBack';
import CompactMetaBar from '@/components/writing/CompactMetaBar';
import ScrollReaderCard from "@/components/writing/ScrollReaderCard";
import KindleChrome from "@/components/writing/KindleChrome";

export async function generateStaticParams() {
    return (await listWriting()).map(slug => ({ slug }));
}

export default async function WritingPage(
    { params }: { params: Promise<{ slug: string }> }
) {
    const { slug } = await params;

    const source = await readWriting(slug);
    const { content, frontmatter } = await compile(source);
    const stats = getReadingStats(source);

    const title = (frontmatter as any).title as string;
    const author = (frontmatter as any).author as string | undefined;
    const cover = (frontmatter as any).cover as string | undefined;
    const tags = (frontmatter as any).tags as string[];
    const minutes = Math.ceil(stats.minutes);

    return (
        <PageTransition>
            <StickyBack />
            <ReaderModePill targetId="reader-container" defaultMode="paged" />

            <ReadingProgress targetId="scroll-article-root" thicknessPx={4} />
            <CompactMetaBar title={title} author={author} minutes={minutes} sentinelId="hero-meta-sentinel" />

            <main className="mx-auto max-w-5xl px-6 py-12">
                {/* Hero */}
                <section id="hero-meta-sentinel" className="mb-8">
                    <div className="mx-auto max-w-4xl px-4">
                        <div className="flex items-start justify-center gap-6">
                            {/* Cover — fixed aspect; scales down on small screens */}
                            {cover && (
                                <figure
                                    aria-label="Cover"
                                    className="relative aspect-[2/3] shrink-0 overflow-hidden 
                                        rounded-xl w-[clamp(96px,28vw,220px)]"
                                >
                                    <Image
                                        src={cover}
                                        alt={title}
                                        fill
                                        sizes="(max-width: 480px) 28vw, (max-width: 960px) 220px, 220px"
                                        className="object-cover"
                                        priority
                                    />
                                </figure>
                            )}

                            {/* Meta */}
                            <header className="min-w-0 max-w-[68ch]">
                                {Array.isArray(tags) && tags.length > 0 && (
                                    <div className="mt-3 flex flex-wrap gap-2">
                                        {tags.map((t) => (
                                            <span
                                                key={t}
                                                className="rounded-full border border-background/10 
                                                bg-white/5 px-2 py-0.5 text-xs opacity-80"
                                            >
                                                {t}
                                            </span>
                                        ))}
                                    </div>
                                )}
                                
                                <h1 className="text-balance text-3xl font-semibold leading-tight">
                                    {title}
                                </h1>

                                <div className="mt-2 text-sm opacity-70">
                                    {author && <span>{author}</span>}
                                </div>

                                <div className="mt-2 text-sm opacity-70">
                                    {minutes} min read
                                </div>
                            </header>
                        </div>
                    </div>
                </section>

                {/* Reader container (Paged default) */}
                <section id="reader-container" data-mode="paged" className="relative">
                    {/* Paged (Kindle-style dark frame + white page) */}
                    <div id="reader-paged">
                        <KindleChrome>
                            <div className="prose">{content}</div>
                        </KindleChrome>
                    </div>

                    {/* Scroll (same white look) */}
                    <div id="reader-scroll" hidden>
                        <ScrollReaderCard id="scroll-article-root">
                            {content}
                        </ScrollReaderCard>
                    </div>
                </section>
            </main>
        </PageTransition>
    );
}