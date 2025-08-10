'use client'
import { useEffect, useState } from 'react';
import { usePlayer } from '@/app/providers';

type Album = { 
    id: string; 
    title: string; 
    cover?: string; 
    tracks: {
        id: string;
        title: string;
        src: string
    }[]
}

export default function AlbumGrid() {
    const [albums, setAlbums] = useState<Album[]>([])
    const { setQueue } = usePlayer();
    
    useEffect(() => {
        fetch('/api/albums').then(r => r.json()).then(setAlbums);
    }, []);
    
    return (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {albums.map(a => (
                <button key={a.id} onClick={() => setQueue(a.tracks.map(t => ({ ...t, album: a.title })))} className="text-left rounded-xl ring-1 ring-white/10 p-5 hover:ring-white/20">
                    <div className="text-lg font-medium">{a.title}</div>
                    <div className="text-white/60 text-sm">{a.tracks.length} tracks</div>
                </button>
            ))}
        </div>
    )
}