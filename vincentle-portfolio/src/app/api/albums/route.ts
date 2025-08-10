import { NextResponse } from 'next/server';
import { getAlbums } from '@/lib/content';

export async function GET() {
    return NextResponse.json(await getAlbums());
}