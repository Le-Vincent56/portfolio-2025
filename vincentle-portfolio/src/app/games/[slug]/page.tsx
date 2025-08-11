import { notFound } from 'next/navigation';
import { readGame } from '@/lib/content';
import { compile } from '@/lib/mdx'
import SharedCover from "@/components/ui/SharedCover";
import PrefetchHome from "@/components/ui/PrefetchHome";
import { Suspense } from "react";
import ClientDelay from '@/components/ui/ClientDelay';

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

            {/* Hero with shared element target */}
            <div className="relative w-full aspect-video rounded-2xl overflow-hidden ring-1 ring-white/10 mb-6">
                <SharedCover slug={slug} cover={cover} />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/30 to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                    <h1 className="text-3xl font-semibold">{title}</h1>
                </div>
            </div>

            {/* Defer heavy body until after the 300ms cover flight */}
            <Suspense fallback={null}>
                {/* simple 320ms delay to let the cover flight complete */}
                {/* You can replace with a precise onLayoutAnimationComplete if desired */}
                <Delay ms={320}>
                    <article className="prose prose-invert max-w-none">{content}</article>
                </Delay>
            </Suspense>
        </div>
    );
}

function Delay({ ms, children }: { ms: number; children: React.ReactNode }) {
    // RSC-safe shim: just waits on the client
    return (
        <span suppressHydrationWarning>
      {/* eslint-disable-next-line react/no-danger */}
            <span dangerouslySetInnerHTML={{ __html: '' }} />
            {/* client-side hook */}
            <ClientDelay ms={ms}>{children}</ClientDelay>
    </span>
    );
}
