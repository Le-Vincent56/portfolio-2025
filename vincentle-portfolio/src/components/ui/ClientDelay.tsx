'use client';
import { useEffect, useState } from 'react';

export default function ClientDelay({ ms, children }: { ms: number; children: React.ReactNode }) {
    const [show, setShow] = useState(false);
    useEffect(() => {
        const id = setTimeout(() => setShow(true), ms);
        return () => clearTimeout(id);
    }, [ms]);
    return show ? <>{children}</> : null;
}