const fs = require('fs');
const path = require('path');
const mm = require('music-metadata');

const ROOT = process.cwd();
const JSON_PATH = path.join(ROOT, 'content', 'audio', 'albums.json');
const PUBLIC_DIR = path.join(ROOT, 'public');

(async () => {
    const json = JSON.parse(fs.readFileSync(JSON_PATH, 'utf8'));
    const updated = [];

    for (const album of json) {
        const tracks = [];
        for (const t of album.tracks) {
            const filePath = path.join(PUBLIC_DIR, t.src.replace(/^\//, ''));
            let duration = t.duration;
            try {
                if (!duration) {
                    const meta = await mm.parseFile(filePath);
                    duration = Math.max(0, Math.round(meta.format.duration ?? 0));
                }
            } catch (e) {
                console.warn(`warn: could not read ${filePath}: ${e.message}`);
                duration = t.duration ?? 0;
            }
            tracks.push({ ...t, duration });
        }
        updated.push({ ...album, tracks });
    }

    fs.writeFileSync(JSON_PATH, JSON.stringify(updated, null, 2));
    console.log('✓ audio durations baked into content/audio/albums.json');
})();
