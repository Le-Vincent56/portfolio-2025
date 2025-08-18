'use client';
import { useRouter } from 'next/navigation';

export default function StickyBack() {
    const router = useRouter();
    return (
        <button
            onClick={() => router.back()}
            aria-label="Go back"
            className="fixed left-4 top-4 z-40 rounded-full border 
            border-white/10 bg-background/80 px-3 py-1.5 text-sm 
            text-text/80 shadow backdrop-blur hover:bg-primary focus:outline-none focus:ring-2 focus:ring-text"
        >
            ← Back
        </button>
    );
}