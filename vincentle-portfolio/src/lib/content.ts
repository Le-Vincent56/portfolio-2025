import fs from 'node:fs/promises';
import path from 'node:path';
import {Album} from "@/lib/types";

const root = process.cwd();
const file = (p: string) => path.join(root, 'content', p);

export async function readGame(slug: string) {
    return await fs.readFile(file(`games/${slug}.mdx`), 'utf8');
}

export async function listGames() {
    const entries = await fs.readdir(file('games'));
    return entries.filter(e => e.endsWith('.mdx')).map(e => e.replace(/\.mdx$/, ''));
}

export async function readWriting(slug: string) {
    return await fs.readFile(file(`writing/${slug}.mdx`), 'utf8');
}

export async function listWriting() {
    const entries = await fs.readdir(file('writing'));
    return entries.filter(e => e.endsWith('.mdx')).map(e => e.replace(/\.mdx$/, ''));
}

export async function getAlbums() {
    const file = path.join(process.cwd(), 'content', 'audio', 'albums.json');
    const raw = await fs.readFile(file, 'utf8');
    
    // defend against sneaky UTF-8 BOM
    const clean = raw.charCodeAt(0) === 0xfeff ? raw.slice(1) : raw;
    return JSON.parse(clean) as Album[];
}