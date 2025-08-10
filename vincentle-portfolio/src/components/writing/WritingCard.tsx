'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';
import { WritingMeta } from '@/lib/types';

export default function WritingCard({ item }: { item: WritingMeta }) {
    return (
        <motion.a
            href={`/writing/${item.slug}`}
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.22 }}
            className="group block max-w-[180px]"
            aria-label={`${item.title} — ${item.type}`}
        >
            <div className="rounded-2xl ring-1 ring-white/10 overflow-hidden bg-[#111218]">
                <div className="relative aspect-[2/3]">
                    {item.cover && (
                        <Image
                            src={item.cover}
                            alt={item.title}
                            fill
                            sizes="180px"
                            className="object-cover transition group-hover:scale-[1.02]"
                        />
                    )}
                </div>
                <div className="p-4">
                    <div className="text-xs text-white/60">{item.type}</div>
                    <div className="text-sm font-medium leading-tight">{item.title}</div>
                </div>
            </div>
        </motion.a>
    );
}