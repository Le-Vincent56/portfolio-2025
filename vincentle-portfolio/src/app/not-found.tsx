import Link from 'next/link'
export default function NotFound() {
    return (
        <main className="min-h-[60vh] grid place-items-center text-center px-6">
            <div>
                <h1 className="text-3xl font-semibold">Page not found</h1>
                <p className="text-white/70 mt-2">Try going back home.</p>
                <Link href="/" className="inline-block mt-4 rounded-full bg-brand px-4 py-2">Home</Link>
            </div>
        </main>
    )
}