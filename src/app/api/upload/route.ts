import { NextRequest, NextResponse } from 'next/server';
import { createServerComponentClient } from '@/lib/supabase/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import { v4 as uuidv4 } from 'uuid';

export async function POST(req: NextRequest) {
    try {
        // 1. Authenticate and check for admin/editor role
        const supabase = await createServerComponentClient();
        const { data: { user } } = await supabase.auth.getUser();

        if (!user) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { data: profile } = await supabase
            .from('profiles')
            .select('role')
            .eq('id', user.id)
            .single();

        if (!profile || !['admin', 'editor'].includes(profile.role)) {
            return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
        }

        // 2. Parse the form data
        const formData = await req.formData();
        const file = formData.get('file') as File;
        const albumId = formData.get('albumId') as string;
        const folderName = formData.get('folderName') as string;

        if (!file) {
            return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
        }

        // 3. Prepare storage path
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        const fileExtension = file.name.split('.').pop();
        const fileName = `${uuidv4()}.${fileExtension}`;

        // Ensure gallery directory exists
        const galleryDir = join(process.cwd(), 'public', 'images', 'gallery');

        // Determine destination folder: priority = folderName > albumId > base gallery
        const targetSubDir = folderName || albumId || '';
        const uploadDir = targetSubDir ? join(galleryDir, targetSubDir) : galleryDir;

        await mkdir(uploadDir, { recursive: true });

        const filePath = join(uploadDir, fileName);

        // 4. Write to filesystem
        await writeFile(filePath, buffer);

        // 5. Return the public URL path
        const publicPath = targetSubDir
            ? `/images/gallery/${targetSubDir}/${fileName}`
            : `/images/gallery/${fileName}`;

        return NextResponse.json({
            success: true,
            path: publicPath,
            name: file.name
        });

    } catch (error) {
        console.error('Upload error:', error);
        return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
