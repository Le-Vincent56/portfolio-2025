import Link from "next/link";

export default function RelatedProjects({ items }: { items: { slug: string; title: string; cover?: string }[] }) {
    if (!items?.length) return null;
    return (
        <section className="text-text mt-16">
            <h2 className="text-2xl font-semibold">Related Projects</h2>
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {items.map((p) => (
                    <Link key={p.slug} href={`/games/${p.slug}`} className="group block rounded-2xl border border-white/10 bg-white/5 p-3 hover:bg-white/[0.07] transition">
                        {p.cover && (
                            <img src={p.cover} alt="" className="mb-3 aspect-[4/3] w-full rounded-xl object-cover" />
                        )}
                        <div className="flex items-center justify-between">
                            <div className="font-medium text-text/90 group-hover:text-text">{p.title}</div>
                            <div className="text-xs text-primary">View →</div>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    );
}