'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { useReducedMotion } from 'framer-motion';

type ReaderApi = {
    page: number;
    pageCount: number;
    next(): void;
    prev(): void;
    jumpTo(p: number): void;
};

export default function PagedReader({
    children,
    maxWidth = 800,   // white page max width
    gap = 96,         // space between columns (pages)
    paddingX = 48,    // inner left/right padding
    paddingY = 48,    // inner top/bottom padding
    topOffset = 112,  // fallback sticky height
    offsetSelectors = '[data-offset]',
    animMs = 220,
    getApiAction,
    onPageChangeAction,
}: {
    children: React.ReactNode;
    maxWidth?: number;
    gap?: number;
    paddingX?: number;
    paddingY?: number;
    topOffset?: number;
    offsetSelectors?: string;
    animMs?: number;
    getApiAction?: (api: ReaderApi) => void;
    onPageChangeAction?: (p: number, t: number) => void;
}) {
    const frameRef = useRef<HTMLDivElement | null>(null);
    const contentRef = useRef<HTMLDivElement | null>(null);

    const pageRef = useRef(1);
    const pagesRef = useRef(1);

    const [page, setPage] = useState(1);
    const [pageCount, setPageCount] = useState(1);

    const reduce = useReducedMotion();
    const settleTimer = useRef<number | null>(null);
    const programmaticTimer = useRef<number | null>(null);
    const isProgrammatic = useRef(false);

    const computeStride = useCallback(() => {
        const frame = frameRef.current;
        if (!frame) return { columnWidth: 0, stride: 0 };

        const visibleW = Math.round(frame.clientWidth);
        const columnWidth = Math.max(0, visibleW - paddingX * 2);
        const stride = columnWidth + gap;
        return { columnWidth, stride };
    }, [gap, paddingX]);

    const snapLeft = useCallback(
        (left: number, smooth = true) => {
            const frame = frameRef.current;
            if (!frame) return;
            const target = Math.round(left);

            isProgrammatic.current = true;
            frame.scrollTo({ left: target, behavior: reduce || !smooth ? 'auto' : 'smooth' });

            // normalize to the exact pixel after animation; then release programmatic guard
            if (programmaticTimer.current) window.clearTimeout(programmaticTimer.current);
            programmaticTimer.current = window.setTimeout(() => {
                frame.scrollLeft = target;
                isProgrammatic.current = false;
            }, smooth ? animMs + 40 : 0);
        },
        [animMs, reduce]
    );

    const jumpTo = useCallback(
        (p: number, smooth = true) => {
            const { stride } = computeStride();
            if (!stride) return;

            const clamped = Math.max(1, Math.min(pagesRef.current, p));
            const left = Math.round((clamped - 1) * stride);
            snapLeft(left, smooth);

            pageRef.current = clamped;
            setPage(clamped);
            onPageChangeAction?.(clamped, pagesRef.current);
        },
        [computeStride, onPageChangeAction, snapLeft]
    );

    const prev = useCallback(() => jumpTo(pageRef.current - 1), [jumpTo]);
    const next = useCallback(() => jumpTo(pageRef.current + 1), [jumpTo]);

    // expose API
    useEffect(() => {
        getApiAction?.({
            get page() { return pageRef.current; },
            get pageCount() { return pagesRef.current; },
            next, prev, jumpTo,
        });
    }, [getApiAction, jumpTo, next, prev]);

    // layout / pageCount
    useEffect(() => {
        const frame = frameRef.current;
        const content = contentRef.current;
        if (!frame || !content) return;

        const compute = () => {
            // measure sticky stack above reader
            const stickies = Array.from(document.querySelectorAll<HTMLElement>(offsetSelectors));
            const stickyHeight = stickies.reduce((sum, el) => sum + el.getBoundingClientRect().height, 0);
            const finalTop = Math.max(topOffset, Math.round(stickyHeight));

            // size the viewport frame
            const frameH = window.innerHeight - finalTop;
            frame.style.height = `${Math.max(320, frameH)}px`;
            frame.style.maxWidth = `${maxWidth}px`;
            frame.style.marginLeft = 'auto';
            frame.style.marginRight = 'auto';
            
            const { columnWidth, stride } = computeStride();

            content.style.height = '100%';
            content.style.padding = `${paddingY}px ${paddingX}px`;
            content.style.columnGap = `${gap}px`;
            content.style.columnWidth = `${columnWidth}px`;
            (content.style as any).columnFill = 'auto';
            content.style.boxSizing = 'border-box';
            (content.style as any).setProperty?.('--reader-py', `${paddingY}px`);
            (content.style as any).setProperty?.('--reader-px', `${paddingX}px`);
            content.style.width = '100%';

            // compute total pages from scrollable width
            const totalScrollable = Math.max(0, frame.scrollWidth - frame.clientWidth);
            const totalPages = Math.max(1, Math.ceil(totalScrollable / stride) + 1);

            pagesRef.current = totalPages;
            setPageCount(totalPages);

            // keep the current page in range & aligned
            jumpTo(Math.min(pageRef.current, totalPages), false);
        };

        const ro = new ResizeObserver(compute);
        ro.observe(document.documentElement);
        ro.observe(frame);
        const t = setTimeout(compute, 50);
        return () => { ro.disconnect(); clearTimeout(t); };
    }, [gap, paddingX, paddingY, topOffset, offsetSelectors, maxWidth, computeStride, jumpTo]);

    // page index + settle (but not during programmatic movement)
    useEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;

        let raf = 0;
        const onScroll = () => {
            cancelAnimationFrame(raf);
            raf = requestAnimationFrame(() => {
                const { stride } = computeStride();
                if (!stride) return;

                const idx = Math.round(frame.scrollLeft / stride) + 1;
                if (idx !== pageRef.current) {
                    pageRef.current = idx;
                    setPage(idx);
                    onPageChangeAction?.(idx, pagesRef.current);
                }

                // skip settle while programmatic animation is running
                if (isProgrammatic.current) return;

                if (settleTimer.current) window.clearTimeout(settleTimer.current);
                settleTimer.current = window.setTimeout(() => {
                    const nearest = Math.max(1, Math.min(pagesRef.current, Math.round(frame.scrollLeft / stride) + 1));
                    const targetLeft = Math.round((nearest - 1) * stride);
                    snapLeft(targetLeft, !reduce);
                }, animMs + 60); // wait until any natural momentum finishes
            });
        };

        frame.addEventListener('scroll', onScroll, { passive: true });
        return () => {
            frame.removeEventListener('scroll', onScroll);
            cancelAnimationFrame(raf);
            if (settleTimer.current) window.clearTimeout(settleTimer.current);
            if (programmaticTimer.current) window.clearTimeout(programmaticTimer.current);
        };
    }, [computeStride, onPageChangeAction, reduce, snapLeft, animMs]);

    // inputs: one page per gesture
    useEffect(() => {
        const frame = frameRef.current;
        if (!frame) return;

        let cooldown = false;
        const onWheel = (e: WheelEvent) => {
            const dx = e.deltaX, dy = e.deltaY;
            const horizontal = Math.abs(dx) > Math.abs(dy) || e.shiftKey;
            if (!horizontal) return;
            e.preventDefault();
            if (cooldown) return; cooldown = true;
            dx > 0 ? next() : prev();
            setTimeout(() => { cooldown = false; }, animMs);
        };

        let sx = 0, sy = 0, active = false;
        const onStart = (e: TouchEvent) => { const t = e.touches[0]; sx = t.clientX; sy = t.clientY; active = true; };
        const onEnd = (e: TouchEvent) => {
            if (!active) return; active = false;
            const t = e.changedTouches[0], dx = t.clientX - sx, dy = t.clientY - sy;
            if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy)) dx < 0 ? next() : prev();
        };

        const onKey = (e: KeyboardEvent) => {
            const el = e.target as HTMLElement;
            if (el && (el.tagName === 'INPUT' || el.tagName === 'TEXTAREA' || el.isContentEditable)) return;
            if (e.key === 'ArrowRight' || e.key === 'PageDown' || (e.key === ' ' && !e.shiftKey)) { e.preventDefault(); next(); }
            if (e.key === 'ArrowLeft'  || e.key === 'PageUp'   || (e.key === ' ' &&  e.shiftKey)) { e.preventDefault(); prev(); }
        };

        frame.addEventListener('wheel', onWheel, { passive: false });
        frame.addEventListener('touchstart', onStart, { passive: true });
        frame.addEventListener('touchend', onEnd, { passive: true });
        window.addEventListener('keydown', onKey);

        return () => {
            frame.removeEventListener('wheel', onWheel);
            frame.removeEventListener('touchstart', onStart);
            frame.removeEventListener('touchend', onEnd);
            window.removeEventListener('keydown', onKey);
        };
    }, [animMs, next, prev]);

    return (
        <div className="relative">
            {/* White page card */}
            <div className="relative rounded-2xl border border-background/20 bg-white text-black shadow-sm">
                {/* Frame (scrollable viewport) */}
                <div
                    ref={frameRef}
                    className="group relative w-full overflow-x-auto overflow-y-hidden overscroll-contain"
                    style={{
                        scrollbarWidth: 'none',          // Firefox
                        msOverflowStyle: 'none' as any,  // legacy Edge/IE
                    }}
                >
                    {/* Multi-column content that truly fills the viewport height */}
                    <div
                        ref={contentRef}
                        className="reader-paged prose max-w-none"
                    >
                        {children}
                    </div>

                    {/* hide webkit scrollbar but keep functionality */}
                    <style jsx>{`
                        div::-webkit-scrollbar { display: none; }
                    `}</style>
                </div>

                {/* Subtle edge cues */}
                <div 
                    aria-hidden 
                    className="pointer-events-none absolute left-0 top-0 
                    h-full w-10 bg-gradient-to-r from-black/10 to-transparent" 
                />
                <div 
                    aria-hidden 
                    className="pointer-events-none absolute right-0 top-0 
                    h-full w-10 bg-gradient-to-l from-black/10 to-transparent" 
                />
            </div>
        </div>
    );
}