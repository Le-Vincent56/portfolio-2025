import fs from 'node:fs/promises';
import path from 'node:path';

const root = process.cwd();
const file = (p: string) => path.join(root, 'content', p);

export async function readGames(slug: string) {
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
    const json = await fs.readFile(file('audio/albums.json'), 'utf8');
    return JSON.parse(json);
}