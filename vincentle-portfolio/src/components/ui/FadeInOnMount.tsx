'use client';

import { motion } from 'framer-motion';

export default function FadeInOnMount({ children, delay = 0.32 }:{
    children: React.ReactNode; delay?: number;
}) {
    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay, duration: 0.20, ease: 'easeInOut' }}
        >
            {children}
        </motion.div>
    );
}
