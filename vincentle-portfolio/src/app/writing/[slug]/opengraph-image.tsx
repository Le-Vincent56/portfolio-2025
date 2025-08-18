import { ImageResponse } from 'next/og';
import { readWriting } from '@/lib/content';
import { compile } from '@/lib/mdx';

export const runtime = 'edge';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default async function Image({ params }: { params: { slug: string } }) {
    const { slug } = await params; // Next 15 async params
    const source = await readWriting(slug);
    const { frontmatter } = await compile(source);

    const title = (frontmatter as any).title as string;
    const author = (frontmatter as any).author as string | undefined;
    const cover = (frontmatter as any).cover as string | undefined;

    // Basic OG layout: blurred cover background + title overlay
    const bg = cover ? new URL(cover, process.env.NEXT_PUBLIC_SITE_URL) : undefined;

    return new ImageResponse(
        (
            <div
                style={{
                    width: '100%',
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    background: '#121212',
                    position: 'relative',
                }}
            >
                {bg && (
                    <img
                        src={bg.toString()}
                        alt=""
                        style={{ position: 'absolute', 
                            inset: 0, width: '100%', 
                            height: '100%', objectFit: 'cover', 
                            filter: 'blur(12px) brightness(0.55)' 
                        }}
                    />
                )}
                <div
                    style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: 16,
                        padding: 48,
                        maxWidth: 1000,
                        color: 'white',
                        fontSize: 56,
                        lineHeight: 1.1,
                    }}
                >
                    <div style={{ fontWeight: 700 }}>{title}</div>
                    {author && <div style={{ fontSize: 28, opacity: 0.8 }}>by {author}</div>}
                </div>
            </div>
        ),
        { ...size }
    );
}