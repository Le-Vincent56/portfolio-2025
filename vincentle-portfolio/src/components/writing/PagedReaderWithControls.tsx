'use client';

import { useRef, useState } from 'react';
import PagedReader from '@/components/writing/PagedReader';
import { ChevronLeft, ChevronRight } from 'lucide-react';

export default function PagedReaderWithControls({
    children,
}: { children: React.ReactNode }) {
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(1);
    const apiRef = useRef<{ next(): void; prev(): void } | null>(null);

    return (
        <div>
            <PagedReader
                getApiAction={(api) => { apiRef.current = api; }}
                onPageChangeAction={(p, t) => { setPage(p); setTotal(t); }}
            >
                {children}
            </PagedReader>

            {/* controls below the reader */}
            <div className="mt-3 flex items-center justify-center gap-3">
                <button
                    onClick={() => apiRef.current?.prev()}
                    disabled={page <= 1}
                    className="inline-flex items-center gap-1 rounded-md border border-black bg-white px-3 py-1.5 text-xs text-black hover:bg-black/5 disabled:opacity-40"
                >
                    <ChevronLeft size={14} /> Prev
                </button>
                <span className="tabular-nums text-xs text-white/70">{page} / {total}</span>
                <button
                    onClick={() => apiRef.current?.next()}
                    disabled={page >= total}
                    className="inline-flex items-center gap-1 rounded-md border border-black bg-white px-3 py-1.5 text-xs text-black hover:bg-black/5 disabled:opacity-40"
                >
                    Next <ChevronRight size={14} />
                </button>
            </div>
        </div>
    );
}