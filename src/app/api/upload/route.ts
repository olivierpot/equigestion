import { NextRequest, NextResponse } from 'next/server';
import { uploadHorsePhoto, generateUniqueFilename } from '@/lib/storage';

export async function POST(request: NextRequest) {
    try {
        const formData = await request.formData();
        const file = formData.get('file') as File | null;
        const horseId = formData.get('horseId') as string | null;

        if (!file) {
            return NextResponse.json({ error: 'Aucun fichier fourni' }, { status: 400 });
        }

        // Validation
        const maxSize = 5 * 1024 * 1024; // 5MB
        const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

        if (file.size > maxSize) {
            return NextResponse.json({ error: 'Le fichier est trop volumineux (max 5MB)' }, { status: 400 });
        }

        if (!allowedTypes.includes(file.type)) {
            return NextResponse.json({ error: 'Format non supporté (JPG, PNG, WEBP uniquement)' }, { status: 400 });
        }

        // Conversion du fichier en Buffer
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);

        // Génération du nom de fichier unique
        const filename = generateUniqueFilename(file.name, horseId || undefined);

        // Upload
        const url = await uploadHorsePhoto(buffer, filename);

        return NextResponse.json({ url });
    } catch (error) {
        console.error('Erreur upload:', error);
        return NextResponse.json({ error: 'Erreur lors de l\'upload' }, { status: 500 });
    }
}
