import bcrypt from "bcryptjs";
import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";

/**
 * Hash un mot de passe avec bcrypt
 */
export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12);
}

/**
 * Vérifie un mot de passe contre un hash
 */
export async function verifyPassword(password: string, hashedPassword: string): Promise<boolean> {
    return bcrypt.compare(password, hashedPassword);
}

/**
 * Récupère l'utilisateur courant depuis la session
 * Retourne null si non connecté
 */
export async function getCurrentUser() {
    const session = await auth();
    return session?.user ?? null;
}

/**
 * Vérifie que l'utilisateur est connecté
 * Redirige vers /login si non connecté
 */
export async function requireAuth() {
    const user = await getCurrentUser();

    if (!user) {
        redirect("/login");
    }

    return user;
}

/**
 * Vérifie que l'utilisateur est admin
 * Redirige vers / si non admin
 */
export async function requireAdmin() {
    const user = await requireAuth();

    if (user.role !== "ADMIN") {
        redirect("/");
    }

    return user;
}

/**
 * Type pour l'utilisateur de session étendu
 */
export type SessionUser = {
    id: string;
    email: string;
    name?: string | null;
    role: string;
};
