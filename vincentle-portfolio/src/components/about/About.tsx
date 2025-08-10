'use client';

import Image from 'next/image';
import { motion } from 'framer-motion';

export default function About() {
    return (
        <motion.section
            id="about"
            className="grid md:grid-cols-2 gap-10 items-center"
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 0.28 }}
        >
            <div>
                <h2 className="text-3xl font-semibold">About</h2>
                <p className="mt-4 text-white/80 max-w-prose">
                    Gameplay & systems programmer • Composer • Writer. I architect clean, modular systems and
                    score the worlds I build.
                </p>
                <div className="mt-6 flex flex-wrap gap-2 text-sm">
                    {['Unity', 'Unreal', 'C#', 'C++', 'FMOD', 'Wwise', 'React'].map((s) => (
                        <span key={s} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">
              {s}
            </span>
                    ))}
                </div>
            </div>

            <div className="relative aspect-[4/5] rounded-2xl overflow-hidden ring-1 ring-white/10">
                {/* replace with your portrait path */}
                <Image
                    src="/images/portrait.jpg"
                    alt="Portrait of Vincent Le"
                    fill
                    sizes="(min-width: 768px) 40vw, 90vw"
                    className="object-cover"
                />
            </div>
        </motion.section>
    );
}
