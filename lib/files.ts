import fs from 'fs/promises';
import path from 'path';

export async function deleteFileFromUrl(url: string | null | undefined) {
    if (!url || !url.startsWith('/uploads/')) return;
    try {
        const filename = url.replace('/uploads/', '');
        // Validate filename to prevent path traversal
        if (filename.includes('..') || filename.includes('/')) return;
        
        const uploadDir = path.join(process.cwd(), "public/uploads");
        const filepath = path.join(uploadDir, filename);
        await fs.unlink(filepath);
    } catch (e) {
        // Ignore errors (file might already be deleted)
        console.error("Error deleting file:", e);
    }
}
