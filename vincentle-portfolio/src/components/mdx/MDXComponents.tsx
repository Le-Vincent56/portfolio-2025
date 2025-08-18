import Image from "next/image";
import type { MDXComponents } from "mdx/types";

export const mdxComponents: MDXComponents = {
    Image: (props: any) => (
        <Image
            {...props}
            alt={props.alt ?? ""}
            width={props.width ?? 1600}
            height={props.height ?? 900}
            sizes="100vw"
            style={{ width: "100%", height: "auto" }}
        />
    ),
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