import {ComponentProps, ReactNode} from "react";
import NextImage from "next/image";
type NextImageProps = ComponentProps<typeof NextImage>;

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