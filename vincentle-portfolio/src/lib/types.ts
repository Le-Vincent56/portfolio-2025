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
    readingTimeText?: string;
}

export type GameFrontmatter = {
    title: string;
    hook?: string;
    roles?: string[];
    engine?: string;
    platform?: string;
    duration?: string;
    cover?: string;
    sections?: string[];
    status?: "Prototype" | "In Development" | "Released";
    highlights?: string[];
    tags?: string[];
    media?: { src: string; type: "image" | "gif" | "video"; caption?: string }[];
};

export type Track = {
    id: string;
    title: string;
    src: string;
    duration?: number;
    albumTitle?: string;
    albumCover?: string;
};

export type Album = {
    id: string;
    title: string;
    cover: string;
    tracks: Track[];
};

export type LoopMode = 'off' | 'track' | 'album';