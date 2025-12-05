import ProgressBar from "@/components/games/ProgressBar";
import SectionTOC from "@/components/games/SectionTOC";
import MobileTOC from "@/components/games/MobileTOC";
import GameHero from "@/components/games/GameHero";
import { readGame } from "@/lib/content";
import { compile } from "@/lib/mdx";
import { GameFrontmatter } from "@/lib/types";
import StickyBack from "@/components/writing/StickyBack";
import RelatedProjects from "@/components/games/RelatedProjects";
import PageTransition from "@/components/ui/PageTransition";
import GameArticle from "@/components/games/GameArticle";


export default async function GamePage({ params }: { params: Promise<{ slug: string }> }) {
    const { slug } = await params;
    const source = await readGame(slug);
    const { content, frontmatter } = await compile(source);
    
    const sections = (frontmatter as GameFrontmatter).sections ?? [];
    const related = (frontmatter as GameFrontmatter & { relatedProjects?: { slug: string; title: string; cover?: string }[] }).relatedProjects ?? [];

    return (
        <PageTransition>
            <div className="bg-background min-h-screen">
                <StickyBack />
                <ProgressBar />

                <div className="mx-auto max-w-6xl px-6 py-12">
                    <div className="grid gap-8 md:grid-cols-[220px_minmax(0,1fr)]">
                        {/* LEFT: sticky TOC */}
                        <aside aria-label="Project sections" className="hidden md:block">
                            <div className="sticky top-24 z-30">
                                <SectionTOC ids={sections} offsetPx={96} />
                            </div>
                        </aside>

                        {/* RIGHT: content */}
                        <main>
                            <GameHero fm={frontmatter as GameFrontmatter} />
                            <GameArticle>
                                {content}
                            </GameArticle>

                            {/* Related projects */}
                            <RelatedProjects items={related} />
                        </main>
                        <MobileTOC ids={sections}/>
                    </div>
                </div>
            </div>
        </PageTransition>
    );
}