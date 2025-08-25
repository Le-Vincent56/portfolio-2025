'use client';

import { useRef, useState } from 'react';
import PagedReader from '@/components/writing/PagedReader';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function KindleChrome({
    children,
}: { children: React.ReactNode }) {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const apiRef = useRef<{ next(): void; prev(): void } | null>(null);

    const progress = total > 1 ? page / total : 0;

    return (
        <div className="mx-auto max-w-[calc(800px+32px)] rounded-3xl border border-black/50 bg-neutral-900/90 p-3 shadow-2xl backdrop-blur">
            {/* White page inside the dark frame */}
            <PagedReader
                getApiAction={(api) => { apiRef.current = api; }}
                onPageChangeAction={(p, t) => { setPage(p); setTotal(t); }}
            >
                {children}
            </PagedReader>

            {/* Bottom status bar */}
            <div className="mt-2 flex items-center gap-3">
                {/* The progress line grows from left up to before controls */}
                <div className="relative h-1 flex-1 overflow-hidden rounded-full bg-white/15 m-2">
                    <div
                        className="absolute inset-y-0 left-0 bg-primary/90 will-change-[width] reader-progress-bar"
                        style={{
                            width: `${Math.max(0, Math.min(100, progress * 100))}%`,
                        }}
                    />
                </div>

                <div className="flex items-center gap-2">
                    <button
                        onClick={() => apiRef.current?.prev()}
                        disabled={page <= 1}
                        className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15 disabled:opacity-40"
                    >
                        <ChevronLeft size={14} /> Prev
                    </button>
                    <span className="tabular-nums text-xs text-white/70">
                        {page} / {total}
                    </span>
                    <button
                        onClick={() => apiRef.current?.next()}
                        disabled={page >= total}
                        className="inline-flex items-center gap-1 rounded-md border border-white/20 bg-white/10 px-3 py-1 text-xs text-white hover:bg-white/15 disabled:opacity-40"
                    >
                        Next <ChevronRight size={14} />
                    </button>
                </div>
            </div>
        </div>
    );
}