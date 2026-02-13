import { Storage } from '@google-cloud/storage';
import fs from 'fs/promises';
import path from 'path';

// Détection de l'environnement
const isProduction = process.env.GCS_BUCKET_NAME !== undefined;

// Configuration GCS pour production
const storage = isProduction
    ? new Storage({
        projectId: process.env.GCS_PROJECT_ID,
    })
    : null;

const bucketName = process.env.GCS_BUCKET_NAME || '';

// Dossier local pour développement
const LOCAL_UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'horses');

/**
 * Upload une photo de cheval
 * @param file - Le fichier Buffer
 * @param filename - Nom du fichier avec extension
 * @returns L'URL publique de la photo
 */
export async function uploadHorsePhoto(file: Buffer, filename: string): Promise<string> {
    if (isProduction && storage) {
        // Mode production: Upload vers GCS
        const bucket = storage.bucket(bucketName);
        const gcsFile = bucket.file(`horses/${filename}`);

        await gcsFile.save(file, {
            metadata: {
                contentType: getContentType(filename),
            },
            public: true,
        });

        // Retourne l'URL publique
        return `https://storage.googleapis.com/${bucketName}/horses/${filename}`;
    } else {
        // Mode développement: Sauvegarde locale
        await fs.mkdir(LOCAL_UPLOAD_DIR, { recursive: true });
        const filePath = path.join(LOCAL_UPLOAD_DIR, filename);
        await fs.writeFile(filePath, file);

        // Retourne l'URL relative accessible via Next.js
        return `/uploads/horses/${filename}`;
    }
}

/**
 * Supprime une photo de cheval
 * @param photoUrl - L'URL de la photo à supprimer
 */
export async function deleteHorsePhoto(photoUrl: string): Promise<void> {
    if (!photoUrl) return;

    if (isProduction && storage && photoUrl.includes('storage.googleapis.com')) {
        // Mode production: Supprimer de GCS
        const filename = photoUrl.split('/').pop();
        if (!filename) return;

        const bucket = storage.bucket(bucketName);
        const file = bucket.file(`horses/${filename}`);

        try {
            await file.delete();
        } catch (error) {
            console.error('Erreur lors de la suppression GCS:', error);
        }
    } else if (photoUrl.startsWith('/uploads/')) {
        // Mode développement: Supprimer du système de fichiers local
        const filename = photoUrl.split('/').pop();
        if (!filename) return;

        const filePath = path.join(LOCAL_UPLOAD_DIR, filename);
        try {
            await fs.unlink(filePath);
        } catch (error) {
            console.error('Erreur lors de la suppression locale:', error);
        }
    }
}

/**
 * Génère un nom de fichier unique
 * @param originalName - Nom original du fichier
 * @param horseId - ID du cheval (optionnel)
 * @returns Nom de fichier unique
 */
export function generateUniqueFilename(originalName: string, horseId?: string): string {
    const ext = path.extname(originalName);
    const timestamp = Date.now();
    const prefix = horseId || 'new';
    return `${prefix}-${timestamp}${ext}`;
}

/**
 * Détermine le content-type basé sur l'extension
 */
function getContentType(filename: string): string {
    const ext = path.extname(filename).toLowerCase();
    const contentTypes: Record<string, string> = {
        '.jpg': 'image/jpeg',
        '.jpeg': 'image/jpeg',
        '.png': 'image/png',
        '.webp': 'image/webp',
    };
    return contentTypes[ext] || 'application/octet-stream';
}

/**
 * Valide le fichier uploadé
 */
export function validateImageFile(file: File): { valid: boolean; error?: string } {
    const maxSize = 5 * 1024 * 1024; // 5MB
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];

    if (file.size > maxSize) {
        return { valid: false, error: 'Le fichier est trop volumineux (max 5MB)' };
    }

    if (!allowedTypes.includes(file.type)) {
        return { valid: false, error: 'Format non supporté (JPG, PNG, WEBP uniquement)' };
    }

    return { valid: true };
}
