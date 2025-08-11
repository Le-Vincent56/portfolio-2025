'use client';
import { useRouter } from 'next/navigation';

export default function BackToHome() {
    const router = useRouter();
    return (
        <button
            onClick={() => router.push('/', { scroll: false })}
            className="mb-4 rounded-full border border-white/20 px-3 py-1.5 text-sm hover:bg-white/10"
        >
            ← Back to all
        </button>
    );
}
