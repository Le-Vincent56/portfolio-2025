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