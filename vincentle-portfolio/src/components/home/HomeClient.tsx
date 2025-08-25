'use client';

import { motion } from 'framer-motion';
import About from '@/components/about/About';
import { Album, GamesMeta, WritingMeta } from '@/lib/types';
import AudioSection from '@/components/audio/AudioSection';
import GamesSection from "@/components/games/GamesSection";
import WritingSection from "@/components/writing/WritingSection";

function Sidebar() {
    return (
        <aside className="hidden lg:block fixed left-6 top-24 w-48 text-sm text-text/70">
            <nav className="space-y-3">
                {[
                    ['#top', 'Top'],
                    ['#about', 'About'],
                    ['#games', 'Games'],
                    ['#audio', 'Audio'],
                    ['#writing', 'Writing'],
                ].map(([href, label]) => (
                    <a key={href} href={href} className="block hover:text-primary transition">
                        {label}
                    </a>
                ))}
            </nav>
        </aside>
    );
}

function Hero() {
    return (
        <motion.section
            id="top"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
        >
            <h1 className="text-5xl md:text-6xl font-semibold tracking-tight">Vincent Le</h1>
            <p className="mt-3 text-text/80 text-lg">Gameplay & Systems • Audio • Writing</p>
            <div className="mt-6 flex gap-3">
                <a
                    href="#games"
                    className="rounded-full bg-primary px-5 py-2.5 font-medium"
                >
                    View Games
                </a>
                <a href="#audio" className="rounded-full border border-white/20 px-5 py-2.5">
                    Listen
                </a>
            </div>
        </motion.section>
    );
}

export default function HomeClient({
        albums,
        games,
        writing,
    }: {
        albums: Album[];
        games: GamesMeta[];
        writing: WritingMeta[];
    }) {
    return (
        <div className="min-h-screen bg-background text-text">
            <Sidebar />

            <main className="mx-auto max-w-7xl px-6 py-10 lg:pl-56 space-y-24">
                <Hero />
                <About />

                {/* Games */}
                <GamesSection games={games}/>

                {/* Audio */}
                <AudioSection albums={albums}/>

                {/* Writing */}
                <WritingSection writings={writing}/>
            </main>
        </div>
    );
}
