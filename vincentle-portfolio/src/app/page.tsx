import { Metadata } from 'next';
import HomeClient from '@/components/home/HomeClient';
import { getAlbums } from '@/lib/content';
import { GetGames } from '@/lib/getGames';
import { GetWritings } from '@/lib/getWriting';
export const metadata: Metadata = {
    title: 'Vincent Le — Game Design & Development',
    description: 'Gameplay/systems, audio, and writing.',
};

export default async function Page() {
    const [albums, projects, writing] = await Promise.all([
        getAlbums(),
        GetGames(),
        GetWritings(),
    ])

    return <HomeClient albums={albums} games={projects} writing={writing} />;
}
