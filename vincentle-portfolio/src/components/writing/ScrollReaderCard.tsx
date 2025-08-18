'use client';
import AnimatedArticle from '@/components/writing/AnimatedArticle';

export default function ScrollReaderCard({
    children,
    id = 'scroll-article-root',
}: { children: React.ReactNode; id?: string }) {
    return (
        <div className="mx-auto max-w-[800px] rounded-2xl bg-text p-8 text-background">
            <AnimatedArticle id={id} className="prose max-w-none">
                {children}
            </AnimatedArticle>
        </div>
    );
}