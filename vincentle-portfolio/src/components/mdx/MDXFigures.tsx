import {ComponentProps, ReactNode} from "react";
import NextImage from "next/image";

type NextImageProps = ComponentProps<typeof NextImage>;

type VideoSource = | string | {src: string; type?: string}[];

type BaseMediaProps = {
    caption?: ReactNode;
    className?: string;
};

type VideoProps = BaseMediaProps & {
    src: VideoSource;
    poster?: string;
    autoPlay?: boolean;
    muted?: boolean;
    loop?: boolean;
    controls?: boolean;
    playsInline?: boolean;
    aspectRatio?: number;
};

function Figcap({ children }: { children?: ReactNode }) {
    if (!children) return null;
    return (
        <figcaption className="mt-2 border-t border-white/10 pt-2 text-xs text-white/60">
            {children}
        </figcaption>
    );
}

export function Figure({
    src,
    alt = "",
    width = 1600,
    height = 900,
    caption,
    priority,
    className = "",
    sizes = "(min-width: 1024px) 980px, 100vw",
}: {
    src: NextImageProps["src"];
    alt?: string;
    width?: number;
    height?: number;
    caption?: ReactNode;
    priority?: boolean;
    className?: string;
    sizes?: string;
}) {
    return (
        <figure className={`not-prose my-6 ${className}`}>
            <NextImage
                src={src}
                alt={alt}
                width={width}
                height={height}
                sizes={sizes}
                priority={priority}
                className="w-full rounded-xl border border-white/10 shadow-lg"
            />
            <Figcap>{caption}</Figcap>
        </figure>
    );
}

export function FloatFigure({
    side = "left",
    maxWidth = 360,
    ...rest
}: {
    side?: "left" | "right";
    maxWidth?: number;
} & Parameters<typeof Figure>[0]) {
    const floatCls = side === "left" ? "md:float-left md:mr-6" : "md:float-right md:ml-6";
    return (
        <Figure
            {...rest}
            className={`my-3 md:my-1 ${floatCls} md:mb-4 md:max-w-[min(45%,${maxWidth}px)] ${rest.className ?? ""}`}
            sizes="(min-width: 768px) 33vw, 100vw"
        />
    );
}


export function TwoUp({
    items,
}: {
    items: Array<{
        src: NextImageProps["src"]; // ← fix here
        alt?: string;
        width?: number;
        height?: number;
        caption?: ReactNode;
    }>;
}) {
    return (
        <div className="not-prose my-8">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {items.map((it, i) => (
                    <Figure
                        key={i}
                        {...it}
                        className="my-0"
                        sizes="(min-width: 640px) 50vw, 100vw"
                    />
                ))}
            </div>
        </div>
    );
}

export function VideoFigure({
    src,
    poster,
    autoPlay = false,
    muted = true,
    loop = true,
    controls = true,
    playsInline = true,
    aspectRatio,
    caption,
    className = "",
}: VideoProps) {
    return (
        <figure className={`not-prose my-6 ${className}`}>
            <div
                className="w-full overflow-hidden rounded-xl border border-white/10 shadow-lg"
                style={aspectRatio ? { aspectRatio: String(aspectRatio) } : undefined}
            >
                <video
                    className="h-full w-full"
                    poster={poster}
                    autoPlay={autoPlay}
                    muted={muted}
                    loop={loop}
                    controls={controls}
                    playsInline={playsInline}
                >
                    {Array.isArray(src)
                        ? src.map((s, i) => <source key={i} src={s.src} type={s.type} />)
                        : <source src={src} />}
                    {/* Lightweight fallback text */}
                    Your browser does not support the video tag.
                </video>
            </div>
            <Figcap>{caption}</Figcap>
        </figure>
    );
}


/** Float video left/right with text wrap */
export function FloatVideo({
    side = "left",
    maxWidth = 360,
    className = "",
    ...rest
}: { side?: "left" | "right"; maxWidth?: number } & VideoProps) {
    const floatCls = side === "left" ? "md:float-left md:mr-6" : "md:float-right md:ml-6";
    return (
        <VideoFigure
            {...rest}
            className={`my-3 md:my-1 ${floatCls} md:mb-4 md:max-w-[min(45%,${maxWidth}px)] ${className}`}
        />
    );
}