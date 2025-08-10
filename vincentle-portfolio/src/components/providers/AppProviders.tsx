'use client';

import { LayoutGroup, AnimatePresence, motion } from 'framer-motion';
import { UIPrefsProvider } from '@/components/prefs/UIPrefsProvider';
import { usePathname } from 'next/navigation';

export default function AppProviders({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    return (
        <UIPrefsProvider>
            <LayoutGroup id="app">
                <AnimatePresence mode="sync" initial={false}>
                    <motion.div key={pathname} initial={false}>
                        {children}
                    </motion.div>
                </AnimatePresence>
            </LayoutGroup>
        </UIPrefsProvider>
    );
}
