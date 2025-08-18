'use client';
import { motion, useReducedMotion } from 'framer-motion';
import type { PropsWithChildren } from 'react';

export default function AnimatedFigure({ children, className = '' }: PropsWithChildren<{ className?: string }>) {
    const reduce = useReducedMotion();
    return (
        <motion.figure
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className={className}
        >
            {children}
        </motion.figure>
    );
}