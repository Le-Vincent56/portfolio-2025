'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import IconSection from './Icons';

export default function About() {
    const reduce = useReducedMotion();

    return (
        <motion.section
            className="about"
            id="about"
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.28 }}
        >
            <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
                {/* LEFT — 2/3 */}
                <div className="lg:col-span-2">
                    <header className="mb-2" id="about-header">
                        <h1 className="text-5xl md:text-6xl font-semibold leading-none tracking-tight">
                            Vincent Le
                        </h1>
                    </header>

                    <p className="mt-4 leading-relaxed text-text/60">
                        I’m a Unity-first Gameplay/Systems Designer who turns ideas into
                        readable, systemic play. I prototype fast, validate with real
                        input/UI, and use audio to make state changes obvious. Recent work
                        explores weather-driven combat and trait-based progression. Open to
                        Gameplay/Systems internships & new-grad roles.
                    </p>

                    <div className="mt-8">
                        <IconSection />
                    </div>
                </div>

                {/* RIGHT — 1/3: portrait */}
                <motion.div
                    className="lg:col-span-1"
                    initial={reduce ? { opacity: 1, y: 0 } : { opacity: 0, y: 8 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.3 }}
                    transition={{ duration: 0.4, ease: 'easeOut' }}
                >
                    <div className="mx-auto w-52 sm:w-56 md:w-60 lg:ml-auto">
                        <div className="relative aspect-[3/4] overflow-hidden rounded-xl border shadow-sm">
                            <Image
                                src="/images/vincent-le.JPEG"
                                alt="Portrait of Vincent Le"
                                fill
                                sizes="(max-width: 1024px) 240px, 320px"
                                priority={false}
                                className="object-cover"
                            />
                        </div>
                    </div>
                </motion.div>
            </div>
        </motion.section>
    );
}