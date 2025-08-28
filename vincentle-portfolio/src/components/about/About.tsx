'use client';

import Image from 'next/image';
import { motion, useReducedMotion } from 'framer-motion';
import IconSection from './Icons'; // adjust path if needed

export default function About() {
    const reduce = useReducedMotion();

    return (
        <section className="about">
            <div className="grid gap-8 lg:grid-cols-3 lg:items-start">
                {/* LEFT — 2/3: header, copy, icons, CTA */}
                <div className="lg:col-span-2">
                    <header className="mb-2">
                        <h2 className="text-2xl font-semibold tracking-tight">About</h2>
                        <p className="mt-2 text-sm opacity-70">
                            Gameplay / Systems Design • Unity 6 • MS GDD @ RIT
                        </p>
                    </header>

                    <p className="mt-4 leading-relaxed">
                        I’m a Unity-first Gameplay/Systems Designer who turns ideas into
                        readable, systemic play. I prototype fast, validate with real
                        input/UI, and use audio to make state changes obvious. Recent work
                        explores weather-driven combat and trait-based progression. Open to
                        Gameplay/Systems internships & new-grad roles.
                    </p>

                    {/* Icon grid */}
                    <div className="mt-8">
                        <IconSection />
                    </div>

                    {/* CTA */}
                    <div className="mt-6">
                        <a
                            href="/VincentLe_Resume.pdf"
                            className="inline-flex items-center rounded-2xl border px-4 py-2 text-sm opacity-90 transition hover:opacity-100 hover:scale-[1.02]"
                        >
                            Resume
                        </a>
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
        </section>
    );
}