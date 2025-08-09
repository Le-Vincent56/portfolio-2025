import {compileMDX} from "next-mdx-remote/rsc";
import remarkGfm from "remark-gfm";
import rehypeSlug from 'rehype-slug';
import rehypeAutolink from 'rehype-autolink-headings';

export async function compile(source: string) {
    return compileMDX<{ 
        title:string; 
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
            options: {
                parseFrontmatter: true,
                mdxOptions: {
                    remarkPlugins: [remarkGfm],
                    rehypePlugins: [rehypeSlug, [rehypeAutolink, {behavior: 'wrap'}]],
                },
            },
        },
    )
}