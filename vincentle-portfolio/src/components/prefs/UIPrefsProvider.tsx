'use client';

import { createContext, useContext, useEffect, useMemo, useState } from 'react';

type UiPrefs = {
    reducedMotion: boolean;               // mirrors OS pref + user override
    parallaxEnabled: boolean;             // micro-parallax
    ringPulseEnabled: boolean;            // breathing outline
    setPrefs: (p: Partial<UiPrefs>) => void;
};

const Ctx = createContext<UiPrefs | null>(null);

export function UIPrefsProvider({ children }: { children: React.ReactNode }) {
    const osPrefersReduced =
        typeof window !== 'undefined' &&
        window.matchMedia &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const [prefs, setState] = useState<UiPrefs>({
        reducedMotion: osPrefersReduced,
        parallaxEnabled: !osPrefersReduced,
        ringPulseEnabled: true,
        setPrefs: () => {},
    });

    // keep in sync with OS changes
    useEffect(() => {
        if (!window.matchMedia) return;
        const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
        const listener = () =>
            setState((s) => ({ ...s, reducedMotion: mq.matches, parallaxEnabled: !mq.matches && s.parallaxEnabled }));
        mq.addEventListener?.('change', listener);
        return () => mq.removeEventListener?.('change', listener);
    }, []);

    const setPrefs = (p: Partial<UiPrefs>) => setState((s) => ({ ...s, ...p }));

    const value = useMemo(() => ({ ...prefs, setPrefs }), [prefs]);
    return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useUIPrefs() {
    const v = useContext(Ctx);
    if (!v) throw new Error('useUiPrefs must be used inside UiPrefsProvider');
    return v;
}
