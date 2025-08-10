'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function PrefetchHome() {
    const router = useRouter();
    
    useEffect(() => {
        router.prefetch('/');
    }, [router]);
    
    return null;
}