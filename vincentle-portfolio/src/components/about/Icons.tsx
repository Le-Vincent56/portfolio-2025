'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { Icon } from '@iconify/react';
import { motion, useReducedMotion } from 'framer-motion';
import type { Variants } from 'framer-motion';

const EXPANSION = 1.25;
const CLEAR_DELAY = 80;
const BASE_TILE = 112;
const GAP_X = 12;
const GAP_Y = 12;

function useInteractiveLayout() {
    const [interactive, setInteractive] = useState(false);
    useEffect(() => {
        const m = window.matchMedia('(hover: hover) and (pointer: fine)');
        const onChange = () => setInteractive(m.matches);
        onChange();
        m.addEventListener('change', onChange);
        return () => m.removeEventListener('change', onChange);
    }, []);
    return interactive;
}

function useStableHover(delay = CLEAR_DELAY) {
    const [active, setActive] = useState<{ row: number; col: number } | null>(null);
    const timerRef = useRef<number | null>(null);

    const cancel = () => {
        if (timerRef.current !== null) {
            window.clearTimeout(timerRef.current);
            timerRef.current = null;
        }
    };

    const set = (rc: { row: number; col: number }) => {
        cancel();
        setActive(rc);
    };

    const scheduleClear = () => {
        cancel();
        timerRef.current = window.setTimeout(() => {
            setActive(null);
            timerRef.current = null;
        }, delay);
    };

    useEffect(() => cancel, []); // cleanup on unmount
    return { active, set, scheduleClear, cancel };
}

// ======= Data ================================================================
type ToolKey =
    | 'Unity'
    | 'C#'
    | 'React'
    | 'C++'
    | 'Wwise'
    | 'GitHub'
    | 'Trello'
    | 'Unreal Engine'
    | 'HTML/CSS'
    | 'JavaScript'
    | 'TypeScript'
    | 'Cubase Pro 12';

type Item = {
    key: ToolKey;
    label: string;
    icon: string;
    row: 0 | 1 | 2;
    col: 0 | 1 | 2 | 3;
};

const ITEMS: Item[] = [
    // Row 1
    { key: 'Unity',         label: 'Unity',         icon: 'simple-icons:unity',         row: 0, col: 0 },
    { key: 'C#',            label: 'C#',            icon: 'simple-icons:csharp',        row: 0, col: 1 },
    { key: 'React',         label: 'React',         icon: 'simple-icons:react',         row: 0, col: 2 },
    { key: 'C++',           label: 'C++',           icon: 'simple-icons:cplusplus',     row: 0, col: 3 },
    // Row 2
    { key: 'Wwise',         label: 'Wwise',         icon: 'simple-icons:wwise',         row: 1, col: 0 },
    { key: 'GitHub',        label: 'GitHub',        icon: 'simple-icons:github',        row: 1, col: 1 },
    { key: 'Trello',        label: 'Trello',        icon: 'simple-icons:trello',        row: 1, col: 2 },
    { key: 'Unreal Engine', label: 'Unreal',        icon: 'simple-icons:unrealengine',  row: 1, col: 3 },
    // Row 3
    { key: 'HTML/CSS',      label: 'HTML/CSS',      icon: 'simple-icons:html5',         row: 2, col: 0 },
    { key: 'JavaScript',    label: 'JavaScript',    icon: 'simple-icons:javascript',    row: 2, col: 1 },
    { key: 'TypeScript',    label: 'TypeScript',    icon: 'simple-icons:typescript',    row: 2, col: 2 },
    { key: 'Cubase Pro 12', label: 'Cubase Pro 12', icon: 'simple-icons:steinberg',     row: 2, col: 3 },
];

const COLS = 4 as const;
const ROWS = 3 as const;

function itemsByColumn(items: Item[]) {
    const cols: Item[][] = Array.from({ length: COLS }, () => []);
    for (const it of items) cols[it.col].push(it);
    for (const col of cols) col.sort((a, b) => a.row - b.row);
    return cols;
}

// ======= Animation ===========================================================
const EASE: [number, number, number, number] = [0.16, 1, 0.3, 1];

const iconVariants: Variants = {
    idle: { y: 0 },
    hover: { y: -14, transition: { duration: 0.18, ease: EASE } },
};

const labelVariants: Variants = {
    idle: { opacity: 0, y: 0 },
    hover: { opacity: 1, y: 25, transition: { duration: 0.18, ease: EASE } },
};

// ======= Helpers =============================================================
function weights(total: number, activeIndex: number | null, expansion = EXPANSION) {
    if (activeIndex === null) return Array(total).fill(1);
    const rest = (total - expansion) / (total - 1);
    return Array.from({ length: total }, (_, i) => (i === activeIndex ? expansion : rest));
}

function transformOriginFor(rc: { row: number; col: number }) {
    const h = rc.col === 0 ? 'left' : rc.col === COLS - 1 ? 'right' : 'center';
    const v = rc.row === 0 ? 'top' : rc.row === ROWS - 1 ? 'bottom' : 'center';
    return `${h} ${v}`;
}

// ======= Component ===========================================================
export default function IconSection() {
    const reduce = useReducedMotion();
    const interactive = useInteractiveLayout();
    const hover = useStableHover();

    const colWeights = useMemo(
        () => weights(COLS, interactive && hover.active ? hover.active.col : null),
        [hover.active, interactive],
    );
    const rowWeights = useMemo(
        () => weights(ROWS, interactive && hover.active ? hover.active.row : null),
        [hover.active, interactive],
    );

    const containerHeight = BASE_TILE * ROWS + GAP_Y * (ROWS - 1);
    const columns = useMemo(() => itemsByColumn(ITEMS), []);

    return (
        <div
            className="flex gap-3"
            style={{ height: containerHeight }}
            onPointerLeave={hover.scheduleClear}
            // keep hover when crossing the gap; only clear when leaving the whole container
        >
            {columns.map((colItems, cIdx) => {
                const colGrow = colWeights[cIdx];
                return (
                    <motion.div
                        key={`col-${cIdx}`}
                        className="flex min-w-0 flex-1 flex-col gap-3"
                        animate={interactive ? { flexGrow: colGrow } : { flexGrow: 1 }}
                        transition={{ duration: 0.22, ease: EASE }}
                    >
                        {colItems.map((it) => {
                            const rowGrow = rowWeights[it.row];
                            const hovered =
                                !!hover.active &&
                                hover.active.row === it.row &&
                                hover.active.col === it.col;

                            return (
                                <motion.div
                                    key={it.key}
                                    className="flex min-h-0 flex-[0_0_auto]"
                                    animate={interactive ? { flexGrow: rowGrow } : { flexGrow: 1 }}
                                    transition={{ duration: 0.22, ease: EASE }}
                                >
                                    <Tile
                                        item={it}
                                        hovered={hovered}
                                        reduce={!!reduce}
                                        onEnter={() => hover.set({ row: it.row, col: it.col })}
                                        onLeaveScheduled={hover.scheduleClear}
                                        onCancelLeave={hover.cancel}
                                    />
                                </motion.div>
                            );
                        })}
                    </motion.div>
                );
            })}
        </div>
    );
}

function Tile({
                  item,
                  hovered,
                  reduce,
                  onEnter,
                  onLeaveScheduled,
                  onCancelLeave,
              }: {
    item: Item;
    hovered: boolean;
    reduce: boolean;
    onEnter: () => void;
    onLeaveScheduled: () => void;
    onCancelLeave: () => void;
}) {
    const origin = transformOriginFor(item);

    return (
        <motion.div
            className={[
                'group relative isolate flex flex-1 select-none items-center justify-center overflow-hidden',
                'rounded-2xl text-current',
                'card-hover card-ring card-ring-hover',
            ].join(' ')}
            style={{ transformOrigin: origin as any }}
            // ENTER: commit immediately; also cancel any pending clear
            onPointerEnter={() => {
                onCancelLeave();
                onEnter();
            }}
            // LEAVE: don't clear here; container will schedule a delayed clear
            onFocus={onEnter}
            onBlur={onLeaveScheduled}
            role="button"
            tabIndex={0}
            aria-label={item.label}
            animate={reduce ? { scale: 1 } : hovered ? { scale: 1.02 } : { scale: 1 }}
            transition={{ duration: 0.18, ease: EASE }}
        >
            {/* Icon */}
            <motion.div
                variants={reduce ? undefined : iconVariants}
                animate={reduce ? 'idle' : hovered ? 'hover' : 'idle'}
                className="relative z-10"
            >
                <Icon icon={item.icon} aria-hidden className="h-12 w-12 opacity-90" />
            </motion.div>

            {/* Desktop label */}
            <motion.span
                variants={reduce ? undefined : labelVariants}
                animate={reduce ? 'idle' : hovered ? 'hover' : 'idle'}
                className="absolute left-1/2 top-1/2 z-10 hidden -translate-x-1/2 -translate-y-1/2 text-xs sm:block"
                style={reduce ? { opacity: 1, transform: 'translate(-50%, -50%)' } : undefined}
            >
                {item.label}
            </motion.span>

            {/* Mobile label */}
            <span className="absolute bottom-1 left-1/2 z-10 block -translate-x-1/2 text-[11px] sm:hidden">
        {item.label}
      </span>
        </motion.div>
    );
}