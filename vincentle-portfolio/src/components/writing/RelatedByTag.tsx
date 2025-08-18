import Link from 'next/link';
import Image from 'next/image';

export default function RelatedByTag({
    items,
}: {
    items: { slug: string; title: string; cover?: string }[];
}) {
    return (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            {items.map((it) => (
                <Link
                    key={it.slug}
                    href={`/writing/${it.slug}`}
                    className="group overflow-hidden rounded-xl border border-white/10 bg-white/5"
                >
                    <div className="relative aspect-[2/3] w-full overflow-hidden">
                        {it.cover && (
                            <Image src={it.cover} alt="" fill sizes="(max-width: 768px) 100vw, 50vw" 
                                   className="object-cover transition-transform duration-300 group-hover:scale-[1.03]" />
                        )}
                    </div>
                    <div className="p-3 text-sm text-text">{it.title}</div>
                </Link>
            ))}
        </div>
    );
}