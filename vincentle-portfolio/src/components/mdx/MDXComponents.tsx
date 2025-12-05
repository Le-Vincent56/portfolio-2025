import { ComponentProps, ReactNode } from "react";
import type { MDXComponents } from "mdx/types";
import {Figure, FloatFigure, FloatVideo, TwoUp, VideoFigure} from "./MDXFigures";
import NextImage from "next/image";
type NextImageProps = ComponentProps<typeof NextImage>;

const MDXImage = (props: NextImageProps) => (
    <NextImage
        {...props}
        alt={props.alt ?? ""}
        width={props.width ?? 1600}
        height={props.height ?? 900}
        sizes={props.sizes ?? "100vw"}
        style={{ width: "100%", height: "auto" }}
    />
);

function Box({ tone, children }: { tone: "info" | "note" | "caution"; children: ReactNode }) {
    const tones = {
        info: "border-primary/40 bg-primary/10",
        note: "border-white/20 bg-white/5",
        caution: "border-amber-400/30 bg-amber-400/10",
    } as const;
    const label = {info: "Info", note: "Note", caution: "Caution"}[tone];
    return (
        <div className={`my-6 rounded-xl border px-4 py-3 ${tones[tone]}`}>
            <div className="text-xs uppercase tracking-wide text-white/60 mb-1">{label}</div>
            <div className="text-white/80">{children}</div>
        </div>
    );
}

export const mdxComponents: MDXComponents = {
    Image: MDXImage,
    Info: ({ children }: { children: ReactNode }) => (<Box tone="info">{children}</Box>),
    Note: ({ children }: { children: ReactNode }) => (<Box tone="note">{children}</Box>),
    Caution: ({ children }: { children: ReactNode }) => (<Box tone="caution">{children}</Box>),
    Figure,
    FloatFigure,
    TwoUp,
    VideoFigure,
    FloatVideo,
};

export const readerHeadingOverrides = {
    h1: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <section className="reader-h1-page">
            <h1 {...props} />
        </section>
    ),
    h2: (props: React.HTMLAttributes<HTMLHeadingElement>) => (
        <section className="reader-h2-wrap">
            <h2 {...props} />
        </section>
    ),
};