export interface GamesMeta {
    slug: string;
    title: string;
    roles: string[];
    hook?: string;
    cover?: string;
}

export interface WritingMeta {
    slug: string;
    title: string;
    type?: string;
    cover?: string;
}

export type Track = {
    id: string;
    title: string;
    src?: string; // optional while mocking
};

export type Album = {
    id: string;
    title: string;
    cover: string;
    tracks: Track[];
};