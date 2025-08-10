'use client'
import { useEffect, useState } from 'react'

export default function TOC() {
    const [heads, setHeads] = useState<{ id: string; text: string }[]>([]);
    
    useEffect(() => {
        const hs = Array.from(document.querySelectorAll('article h2, article h3'))
            .map(h => ({ id: (h as HTMLElement).id, text: h.textContent || ''}));
        setHeads(hs);
    }, [])
    
    return (
        <nav aria-label="Table of contents" className="hidden xl:block sticky top-24 h-fit text-sm text-white/70">
            <div className="font-medium mb-2">On this page</div>
            <ul className="space-y-1">
                {heads.map(h => <li key={h.id}><a href={`#${h.id}`} className="hover:text-white">{h.text}</a></li>)}
            </ul>
        </nav>
    );
}