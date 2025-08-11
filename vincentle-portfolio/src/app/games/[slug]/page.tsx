import { notFound } from 'next/navigation';
import { readGame } from '@/lib/content';
import { compile } from '@/lib/mdx'
import SharedCover from "@/components/ui/SharedCover";
import PrefetchHome from "@/components/ui/PrefetchHome";
import BackToHome from '@/components/ui/BackToHome';
import FadeInOnMount from "@/components/ui/FadeInOnMount";

export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    
    const raw = await readGame(slug).catch(() => null);
    if (!raw) return notFound();

    const { content, frontmatter } = await compile(raw)

    const title = (frontmatter.title as string) ?? slug;
    const cover = (frontmatter.cover as string) ?? `/images/games/${slug}.jpg`;

    return (
        <div className="mx-auto max-w-4xl px-6 py-10">
            <PrefetchHome />
            <BackToHome />

            {/* Hero with the shared element target */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden ring-1 ring-white/10 mb-6">
                <SharedCover slug={slug} cover={cover} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                    <h1 className="text-3xl font-semibold">{title}</h1>
                </div>
            </div>

            <FadeInOnMount delay={0.32}>
                <article className="prose prose-invert max-w-none">{content}</article>
            </FadeInOnMount>
        </div>
    );
}
