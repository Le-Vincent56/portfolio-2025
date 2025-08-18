import {compileMDX} from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from 'rehype-slug';
import rehypeAutolink from 'rehype-autolink-headings';
import {mdxComponents, readerHeadingOverrides} from "@/components/mdx/MDXComponents";

export async function compile(source: string) {
    return compileMDX<{ 
        title:string; 
        author?: string;
        tags?:string[]; 
        cover?:string; 
        hook:string; 
        roles?:string[]; 
        sections?:string[]; 
        duration?:string; 
        engine?:string; 
        platform?:string[]}>
    (
        {
            source,
            components: { ...mdxComponents, ...readerHeadingOverrides },
            options: {
                parseFrontmatter: true,
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug],
                },
            },
        },
    )
}