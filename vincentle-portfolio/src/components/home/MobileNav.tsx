"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, AnimatePresence } from "framer-motion";

export function MobileStickyHeader({
    visible,
    onOpenAction,
}: {
    visible: boolean;
    onOpenAction: () => void;
}) {
    const reduce = useReducedMotion();
    const [progress, setProgress] = useState(0);

    useEffect(() => {
        const onScroll = () => {
            const doc = document.documentElement;
            const max = doc.scrollHeight - window.innerHeight;
            setProgress(max > 0 ? Math.min(Math.max(doc.scrollTop / max, 0), 1) : 0);
        };
        onScroll();
        window.addEventListener("scroll", onScroll, { passive: true });
        window.addEventListener("resize", onScroll);
        return () => {
            window.removeEventListener("scroll", onScroll);
            window.removeEventListener("resize", onScroll);
        };
    }, []);

    return (
        <motion.div
            className="lg:hidden sticky top-0 z-50 pointer-events-none"
            initial={false}
            animate={{ y: visible ? 0 : -72, opacity: visible ? 1 : 0 }}
            transition={{ duration: reduce ? 0 : 0.2, ease: "easeOut" }}
        >
            <div
                className="pointer-events-auto px-3 pt-3 pb-4 relative"
                style={{ paddingTop: "calc(env(safe-area-inset-top) + 10px)" }}
            >
                <div
                    className="relative flex items-center justify-between
                        rounded-2xl overflow-hidden  /* <-- key: clip to rounded corners */
                        border border-border/70 bg-background-accent/80 backdrop-blur
                        shadow-[0_8px_24px_rgba(0,0,0,0.25)] px-4 py-3"
                >
                    {/* brand cluster */}
                    <div className="flex items-center gap-3">
                        <div className="relative h-9 w-9 rounded-xl border border-white/10 overflow-hidden bg-background-logo">
                            {/* Logo fills the badge but keeps aspect */}
                            <Image
                                src="/logo.png"           // public/logo.png
                                alt="Site icon"
                                fill
                                sizes="36px"
                                className="object-contain p-1"
                            />
                        </div>
                        <div className="leading-tight">
                            <span className="block text-sm font-medium text-white/90">VINCENT&nbsp;LE</span>
                            <span className="block text-[11px] uppercase text-white/50 tracking-wide">Navigate</span>
                        </div>
                    </div>

                    {/* hamburger (small icon, full-size touch target) */}
                    <button
                        type="button"
                        aria-label="Open navigation menu"
                        aria-haspopup="dialog"
                        onClick={onOpenAction}
                        className="rounded-xl border border-border/60 px-3 py-2 text-sm hover:bg-white/5"
                    >
                        <span className="sr-only">Open menu</span>
                        <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                            <path d="M3 6h18M3 12h18M3 18h18" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                        </svg>
                    </button>

                    {/* Progress bar that follows the rounded corners */}
                    <div className="pointer-events-none absolute left-0 right-0 bottom-0 h-0.5">
                        {/* optional faint track */}
                        <div className="absolute inset-0 bg-white/10" />
                        {/* fill (spans full width, clipped by capsule corners) */}
                        <motion.span
                            className="relative block h-full bg-[var(--color-primary)]"
                            initial={false}
                            animate={{ width: `${progress * 100}%` }}
                            transition={{ duration: reduce ? 0 : 0.18, ease: "easeOut" }}
                            // no border-radius needed; overflow-hidden on the capsule clips the ends to the curve
                        />
                    </div>
                </div>
            </div>
        </motion.div>
    );
}

export function MobileMenu({
    open,
    onCloseAction,
}: {
    open: boolean;
    onCloseAction: () => void;
}) {
    const reduce = useReducedMotion();

    // Lock page scroll while menu is open
    useEffect(() => {
        if (!open) return;
        const prev = document.documentElement.style.overflow;
        document.documentElement.style.overflow = "hidden";
        return () => {
            document.documentElement.style.overflow = prev;
        };
    }, [open]);

    const MenuItem = ({
                          href,
                          children,
                      }: {
        href: string;
        children: React.ReactNode;
    }) => (
        <a
            href={href}
            onClick={onCloseAction}
            className="group relative block rounded-xl border border-white/10
                 bg-[linear-gradient(180deg,rgba(255,255,255,0.05),rgba(255,255,255,0.02))]
                 px-3 py-3 hover:bg-white/[0.06] focus:outline-none focus-visible:ring-2
                 focus-visible:ring-[var(--color-primary)]/60 transition-colors"
        >
            <div className="flex items-center justify-between gap-3">
                <div className="flex items-center gap-3">
                    {/* dot icon */}
                    <span className="inline-block h-2 w-2 rounded-full bg-[var(--color-primary)]/70 ring-1 ring-[var(--color-primary)]/30" />
                    <span className="text-base font-medium text-white/90">{children}</span>
                </div>
                {/* chevron */}
                <svg
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    className="opacity-50 group-hover:opacity-90 transition-opacity"
                    aria-hidden="true"
                >
                    <path d="M9 6l6 6-6 6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" fill="none" />
                </svg>
            </div>
            {/* bottom hairline */}
            <span className="pointer-events-none absolute inset-x-3 bottom-1 block h-px bg-white/5" />
        </a>
    );

    return (
        <AnimatePresence>
            {open && (
                <motion.div
                    key="menu-root"
                    className="lg:hidden fixed inset-0 z-[60]"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: reduce ? 0 : 0.15 }}
                >
                    {/* Backdrop */}
                    <motion.div
                        onClick={onCloseAction}
                        className="absolute inset-0 bg-black/30"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                    />

                    {/* Stylized panel */}
                    <motion.div
                        role="dialog"
                        aria-modal="true"
                        aria-labelledby="mobileMenuTitle"
                        className="absolute left-0 right-0 top-0 rounded-b-2xl
                       border border-border/70 bg-background-accent/80 backdrop-blur
                       shadow-[0_20px_40px_rgba(0,0,0,0.35)]"
                        initial={{ y: -24, opacity: 0 }}
                        animate={{ y: 0, opacity: 1 }}
                        exit={{ y: -24, opacity: 0 }}
                        transition={reduce ? { duration: 0 } : { type: "spring", stiffness: 520, damping: 42 }}
                        style={{ paddingTop: "max(env(safe-area-inset-top), 0px)" }}
                    >
                        {/* Panel header (brand cluster again for cohesion) */}
                        <div className="flex items-center justify-between px-4 py-3">
                            <div className="flex items-center gap-3">
                                <div className="relative grid place-items-center h-8 w-8 rounded-xl border border-white/10 overflow-hidden">
                                    <div className="absolute inset-0 opacity-20 bg-[radial-gradient(50%_50%_at_50%_0%,#fff_0%,transparent_60%)]" />
                                    <span className="text-[11px] font-semibold tracking-wider text-white/90">VL</span>
                                </div>
                                <div className="leading-tight">
                  <span id="mobileMenuTitle" className="block text-[11px] uppercase text-white/50 tracking-wide">
                    Quick Links
                  </span>
                                    <span className="block text-sm font-medium text-white/90">Navigate</span>
                                </div>
                            </div>

                            <button
                                onClick={onCloseAction}
                                aria-label="Close menu"
                                className="rounded-xl border border-border/60 px-3 py-2 text-sm hover:bg-white/5"
                            >
                                <span className="sr-only">Close</span>
                                <svg width="16" height="16" viewBox="0 0 24 24" aria-hidden="true">
                                    <path d="M6 6l12 12M18 6l-12 12" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
                                </svg>
                            </button>
                        </div>

                        {/* Link list */}
                        <nav className="px-3 pb-4 space-y-2">
                            <MenuItem href="#about">About</MenuItem>
                            <MenuItem href="#games">Games</MenuItem>
                            <MenuItem href="#audio">Audio</MenuItem>
                            <MenuItem href="#writing">Writing</MenuItem>
                        </nav>
                    </motion.div>
                </motion.div>
            )}
        </AnimatePresence>
    );
}
