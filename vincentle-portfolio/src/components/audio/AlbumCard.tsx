'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { Album } from '@/lib/types';
import { cn } from '@/lib/utils';

export default function AlbumCard({
                                      album,
                                      currentId,
                                      playing,
                                      onPlay,
                                  }: {
    album: Album;
    currentId?: string;
    playing: boolean;
    onPlay: (album: Album, index: number) => void;
}) {
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.22 }}
            className="rounded-2xl ring-1 ring-white/10 bg-[#111218] overflow-hidden"
        >
            <div className="flex items-center gap-4 p-4 border-b border-white/10">
                <div className="relative h-14 w-14 overflow-hidden rounded-lg ring-1 ring-white/10">
                    <Image src={album.cover} alt="" fill sizes="56px" className="object-cover" />
                </div>
                <div className="min-w-0">
                    <div className="text-lg font-medium truncate">{album.title}</div>
                    <div className="text-white/60 text-sm">{album.tracks.length} tracks</div>
                </div>
            </div>

            <div className="max-h-60 overflow-auto divide-y divide-white/5">
                {album.tracks.map((t, i) => {
                    const isCurrent = currentId === t.id;
                    return (
                        <button
                            key={t.id}
                            onClick={() => onPlay(album, i)}
                            className={cn(
                                'w-full text-left px-4 py-3 flex items-center gap-3 hover:bg-white/5 transition',
                                isCurrent && 'bg-white/10'
                            )}
                            aria-label={`Play ${t.title}`}
                        >
                            <div className="relative h-10 w-10 overflow-hidden rounded-md ring-1 ring-white/10 flex-shrink-0">
                                <Image src={album.cover} alt="" fill sizes="40px" className="object-cover" />
                            </div>
                            <div className="min-w-0 flex-1">
                                <div className="truncate">{t.title}</div>
                                <div className="text-xs text-white/60">Track</div>
                            </div>
                            <div className="ml-auto">
                <span
                    className={cn(
                        'inline-flex items-center justify-center h-8 w-8 rounded-full',
                        isCurrent ? 'bg-white text-black' : 'bg-white/10 text-white'
                    )}
                >
                  {isCurrent && playing ? '▐▐' : '►'}
                </span>
                            </div>
                        </button>
                    );
                })}
            </div>
        </motion.div>
    );
}
