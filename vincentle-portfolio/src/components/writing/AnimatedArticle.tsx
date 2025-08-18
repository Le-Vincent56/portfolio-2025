'use client';
import { motion, useReducedMotion, type HTMLMotionProps } from 'framer-motion';

export default function AnimatedArticle({ className = '', ...rest }: HTMLMotionProps<'article'>) {
    const reduce = useReducedMotion();
    return (
        <motion.article
            initial={reduce ? false : { opacity: 0, y: 8 }}
            animate={reduce ? {} : { opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className={className}
            {...rest}
        />
    );
}