'use client';

import About from '@/components/about/About';
import { Album, GamesMeta, WritingMeta } from '@/lib/types';
import AudioSection from '@/components/audio/AudioSection';
import GamesSection from '@/components/games/GamesSection';
import WritingSection from '@/components/writing/WritingSection';
import { useEffect, useState } from 'react';
import { LayoutGroup } from 'framer-motion';
import HomeSectionTOC from '@/components/home/HomeSectionTOC';
import { MobileStickyHeader, MobileMenu } from '@/components/home/MobileNav';

export default function HomeClient({
    albums,
    games,
    writing,
}: {
    albums: Album[];
    games: GamesMeta[];
    writing: WritingMeta[];
}) {
    const [menuOpen, setMenuOpen] = useState(false);
    const [stickyActive, setStickyActive] = useState(false);

    // Trigger exactly when the About <header> leaves/enters viewport
    useEffect(() => {
        const target = document.getElementById('about-header');
        if (!target) return;

        const io = new IntersectionObserver(
            ([entry]) => setStickyActive(!entry.isIntersecting),
            { threshold: 0 }
        );
        io.observe(target);
        return () => io.disconnect();
    }, []);

    return (
        <LayoutGroup id="home-shared">
            <div className="min-h-screen bg-background text-text">
                {/* Desktop sidebar (lg+) */}
                <aside className="hidden lg:block fixed left-6 top-24 w-48 text-sm text-text/70">
                    <HomeSectionTOC ids={['about', 'games', 'audio', 'writing']} offsetPx={96} />
                </aside>

                {/* Mobile sticky header + menu */}
                <MobileStickyHeader
                    visible={stickyActive}
                    onOpenAction={() => setMenuOpen(true)}
                />
                <MobileMenu open={menuOpen} onCloseAction={() => setMenuOpen(false)} />

                <main className="mx-auto max-w-7xl px-6 py-10 lg:pl-56 space-y-24">
                    <About />
                    <GamesSection games={games} />
                    <AudioSection albums={albums} />
                    <WritingSection writings={writing} />
                </main>
            </div>
        </LayoutGroup>
    );
}