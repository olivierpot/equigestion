"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";
import { requireAdmin, hashPassword } from "@/lib/auth-utils";

/**
 * Récupère tous les utilisateurs (gérants)
 */
export async function getUsers() {
    await requireAdmin();

    try {
        const users = await db.user.findMany({
            where: { role: "MANAGER" },
            select: {
                id: true,
                email: true,
                name: true,
                isActive: true,
                createdAt: true,
                _count: {
                    select: {
                        horses: true,
                        owners: true,
                    },
                },
            },
            orderBy: {
                createdAt: "desc",
            },
        });
        return users;
    } catch (error) {
        console.error("Erreur lors de la récupération des utilisateurs:", error);
        return [];
    }
}

/**
 * Récupère les statistiques admin
 */
export async function getAdminStats() {
    await requireAdmin();

    try {
        const [totalManagers, activeManagers, totalHorses, totalOwners] = await Promise.all([
            db.user.count({ where: { role: "MANAGER" } }),
            db.user.count({ where: { role: "MANAGER", isActive: true } }),
            db.horse.count(),
            db.owner.count(),
        ]);

        return {
            totalManagers,
            activeManagers,
            totalHorses,
            totalOwners,
        };
    } catch (error) {
        console.error("Erreur lors de la récupération des stats:", error);
        return {
            totalManagers: 0,
            activeManagers: 0,
            totalHorses: 0,
            totalOwners: 0,
        };
    }
}

/**
 * Crée un nouveau gérant
 */
export async function createUser(formData: FormData) {
    await requireAdmin();

    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email || !password) {
            throw new Error("Email et mot de passe sont requis");
        }

        if (password.length < 6) {
            throw new Error("Le mot de passe doit contenir au moins 6 caractères");
        }

        // Vérifier si l'email existe déjà
        const existing = await db.user.findUnique({ where: { email } });
        if (existing) {
            throw new Error("Cet email est déjà utilisé");
        }

        const hashedPassword = await hashPassword(password);

        const user = await db.user.create({
            data: {
                email,
                password: hashedPassword,
                name: name || null,
                role: "MANAGER",
                isActive: true,
            },
        });

        revalidatePath("/admin/users");

        return { success: true, user: { id: user.id, email: user.email } };
    } catch (error) {
        console.error("Erreur lors de la création du gérant:", error);
        const message = error instanceof Error ? error.message : "Impossible de créer le gérant";
        return { success: false, error: message };
    }
}

/**
 * Met à jour un gérant
 */
export async function updateUser(userId: string, formData: FormData) {
    await requireAdmin();

    try {
        const name = formData.get("name") as string;
        const email = formData.get("email") as string;
        const password = formData.get("password") as string;

        if (!email) {
            throw new Error("L'email est requis");
        }

        // Vérifier si l'email existe déjà pour un autre utilisateur
        const existing = await db.user.findFirst({
            where: { email, NOT: { id: userId } },
        });
        if (existing) {
            throw new Error("Cet email est déjà utilisé");
        }

        const updateData: { name: string | null; email: string; password?: string } = {
            name: name || null,
            email,
        };

        // Mettre à jour le mot de passe seulement s'il est fourni
        if (password && password.length > 0) {
            if (password.length < 6) {
                throw new Error("Le mot de passe doit contenir au moins 6 caractères");
            }
            updateData.password = await hashPassword(password);
        }

        await db.user.update({
            where: { id: userId },
            data: updateData,
        });

        revalidatePath("/admin/users");

        return { success: true };
    } catch (error) {
        console.error("Erreur lors de la mise à jour du gérant:", error);
        const message = error instanceof Error ? error.message : "Impossible de modifier le gérant";
        return { success: false, error: message };
    }
}

/**
 * Active/Désactive un gérant
 */
export async function toggleUserActive(userId: string) {
    await requireAdmin();

    try {
        const user = await db.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        if (user.role === "ADMIN") {
            throw new Error("Impossible de désactiver un admin");
        }

        await db.user.update({
            where: { id: userId },
            data: { isActive: !user.isActive },
        });

        revalidatePath("/admin/users");

        return { success: true, isActive: !user.isActive };
    } catch (error) {
        console.error("Erreur lors du changement de statut:", error);
        const message = error instanceof Error ? error.message : "Impossible de changer le statut";
        return { success: false, error: message };
    }
}

/**
 * Supprime un gérant et toutes ses données
 */
export async function deleteUser(userId: string) {
    await requireAdmin();

    try {
        const user = await db.user.findUnique({ where: { id: userId } });

        if (!user) {
            throw new Error("Utilisateur non trouvé");
        }

        if (user.role === "ADMIN") {
            throw new Error("Impossible de supprimer un admin");
        }

        // La suppression cascade grâce à onDelete: Cascade
        await db.user.delete({
            where: { id: userId },
        });

        revalidatePath("/admin/users");

        return { success: true };
    } catch (error) {
        console.error("Erreur lors de la suppression du gérant:", error);
        const message = error instanceof Error ? error.message : "Impossible de supprimer le gérant";
        return { success: false, error: message };
    }
}
