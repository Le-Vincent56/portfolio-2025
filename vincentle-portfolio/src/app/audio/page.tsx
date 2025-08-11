import { getAlbums } from '@/lib/content'
import Link from 'next/link'
import PageTransition from "@/components/ui/PageTransition";

export default async function AudioPage() {
    const albums = await getAlbums()
    return (
        <PageTransition>
            <main className="mx-auto max-w-6xl px-6 py-12">
                <h1 className="text-3xl font-semibold mb-6">Audio</h1>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {albums.map((a:any) => (
                        <div key={a.id} className="rounded-xl ring-1 ring-white/10 p-5">
                            <div className="text-lg font-medium">{a.title}</div>
                            <div className="text-white/60 text-sm mb-4">{a.tracks.length} tracks</div>
                            {/* In v1, clicking sets the global queue from the homepage or a client component here */}
                            <Link href="/" className="text-sm text-white/80 underline">Load in player</Link>
                        </div>
                    ))}
                </div>
            </main>
        </PageTransition>
    )
}