"use client";
import { useEffect } from "react";

export function Lightbox({ src, alt, onClose }: { src: string; alt?: string; onClose: () => void }) {
    useEffect(() => {
        const onKey = (e: KeyboardEvent) => e.key === "Escape" && onClose();
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);
    return (
        <div className="fixed inset-0 z-50" role="dialog" aria-modal="true" onClick={onClose}>
            <div className="absolute inset-0 bg-background/80" />
            <img src={src} alt={alt} className="absolute inset-0 m-auto max-h-[92vh] max-w-[92vw] rounded-xl shadow-2xl" />
        </div>
    );
}