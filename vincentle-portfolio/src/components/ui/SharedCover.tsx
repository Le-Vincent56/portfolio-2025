'use client';

import { motion } from 'framer-motion';
import Image from 'next/image';

export default function SharedCover({ slug, cover }: { slug: string; cover: string }) {
    return (
        <motion.div
            layoutId={`cover-${slug}`}
            className="absolute inset-0 rounded-2xl transform-gpu will-change-transform"
            initial={false}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
        >
            <Image src={cover} alt="" fill className="object-cover" priority />
        </motion.div>
    );
}
