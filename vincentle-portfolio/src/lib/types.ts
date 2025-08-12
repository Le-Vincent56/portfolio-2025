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