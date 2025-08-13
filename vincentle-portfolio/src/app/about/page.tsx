import Image from 'next/image'
import PageTransition from '@/components/ui/PageTransition'

export default function AboutPage() {
    return (
        <PageTransition>
            <main className="mx-auto max-w-6xl px-6 py-12 grid gap-10 md:grid-cols-2 items-center">
                <div>
                    <h1 className="text-3xl font-semibold">About</h1>
                    <p className="mt-4 text-text/80">Gameplay & systems programmer, composer/audio designer, and narrative writer. I architect clean, modular systems and score the worlds I build.</p>
                    <div className="mt-6 flex flex-wrap gap-2 text-sm">
                        {['Unity','Unreal','C#','C++','FMOD','Wwise','React'].map(s => (
                            <span key={s} className="rounded-full bg-white/5 px-3 py-1 ring-1 ring-white/10">{s}</span>
                        ))}
                    </div>
                </div>
                <div className="aspect-[4/5] relative rounded-2xl overflow-hidden ring-1 ring-white/10">
                    <Image src="/images/portrait.jpg" alt="Vincent Le" fill className="object-cover" />
                </div>
            </main>
        </PageTransition>
    )
}