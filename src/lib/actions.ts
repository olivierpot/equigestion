"use server";

import { db } from "@/lib/db";
import { revalidatePath } from "next/cache";

/**
 * Récupère tous les chevaux avec leurs propriétaires
 */
export async function getHorses() {
    try {
        const horses = await db.horse.findMany({
            include: {
                owner: true,
                group: true,
            },
            orderBy: {
                name: "asc",
            },
        });
        return horses;
    } catch (error) {
        console.error("Erreur lors de la récupération des chevaux:", error);
        return [];
    }
}

/**
 * Récupère les rendez-vous du jour
 */
export async function getTodayAppointments() {
    try {
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);

        const appointments = await db.appointment.findMany({
            where: {
                date: {
                    gte: today,
                    lt: tomorrow,
                },
            },
            include: {
                provider: true,
                horses: true,
            },
        });
        return appointments;
    } catch (error) {
        console.error("Erreur lors de la récupération des rendez-vous:", error);
        return [];
    }
}

/**
 * Récupère les alertes sanitaires (suivis médicaux en cours)
 */
export async function getActiveMedicalAlerts() {
    try {
        const trackings = await db.medicalTracking.findMany({
            where: {
                status: "ONGOING",
            },
            include: {
                horse: true,
                history: {
                    orderBy: {
                        date: "desc",
                    },
                    take: 1,
                },
            },
        });
        return trackings;
    } catch (error) {
        console.error("Erreur lors de la récupération des alertes médicales:", error);
        return [];
    }
}

/**
 * Récupère tous les propriétaires
 */
export async function getOwners() {
    try {
        const owners = await db.owner.findMany({
            orderBy: {
                name: "asc",
            },
        });
        return owners;
    } catch (error) {
        console.error("Erreur lors de la récupération des propriétaires:", error);
        return [];
    }
}

/**
 * Crée un propriétaire (pour les tests ou usage rapide)
 */
export async function createOwner(name: string, email?: string) {
    try {
        const owner = await db.owner.create({
            data: { name, email },
        });
        return { success: true, owner };
    } catch (error) {
        console.error("Erreur lors de la création du propriétaire:", error);
        return { success: false, error: "Impossible de créer le propriétaire" };
    }
}

/**
 * Crée un nouveau cheval
 */
export async function createHorse(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const breed = formData.get("breed") as string;
        const groupId = formData.get("groupId") as string;
        const ownerId = formData.get("ownerId") as string;
        const foodRation = formData.get("foodRation") as string;
        const photoUrl = formData.get("photoUrl") as string;

        if (!name || !ownerId) {
            throw new Error("Nom et Propriétaire sont requis");
        }

        const horse = await db.horse.create({
            data: {
                name,
                breed,
                photoUrl: photoUrl || null,
                groupId: groupId || null,
                ownerId,
                foodRation,
            },
        });

        revalidatePath("/horses");
        revalidatePath("/");

        return { success: true, horse };
    } catch (error) {
        console.error("Erreur lors de la création du cheval:", error);
        return { success: false, error: "Impossible de créer le cheval" };
    }
}

/**
 * Met à jour un cheval existant
 */
export async function updateHorse(horseId: string, formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const breed = formData.get("breed") as string;
        const groupId = formData.get("groupId") as string;
        const ownerId = formData.get("ownerId") as string;
        const foodRation = formData.get("foodRation") as string;
        const photoUrl = formData.get("photoUrl") as string;

        if (!name || !ownerId) {
            throw new Error("Nom et Propriétaire sont requis");
        }

        const horse = await db.horse.update({
            where: { id: horseId },
            data: {
                name,
                breed,
                photoUrl: photoUrl || null,
                groupId: groupId || null,
                ownerId,
                foodRation,
            },
        });

        revalidatePath("/horses");
        revalidatePath("/");

        return { success: true, horse };
    } catch (error) {
        console.error("Erreur lors de la mise à jour du cheval:", error);
        return { success: false, error: "Impossible de modifier le cheval" };
    }
}

/**
 * Récupère tous les groupes
 */
export async function getGroups() {
    try {
        const groups = await db.group.findMany({
            orderBy: {
                name: "asc",
            },
        });
        return groups;
    } catch (error) {
        console.error("Erreur lors de la récupération des groupes:", error);
        return [];
    }
}

/**
 * Crée un nouveau groupe
 */
export async function createGroup(name: string) {
    try {
        const group = await db.group.create({
            data: { name },
        });
        revalidatePath("/horses");
        revalidatePath("/settings/groups");
        return { success: true, group };
    } catch (error) {
        console.error("Erreur lors de la création du groupe:", error);
        return { success: false, error: "Impossible de créer le groupe" };
    }
}

/**
 * Met à jour un groupe
 */
export async function updateGroup(id: string, name: string) {
    try {
        const group = await db.group.update({
            where: { id },
            data: { name },
        });
        revalidatePath("/horses");
        revalidatePath("/settings/groups");
        return { success: true, group };
    } catch (error) {
        console.error("Erreur lors de la modification du groupe:", error);
        return { success: false, error: "Impossible de modifier le groupe" };
    }
}

/**
 * Supprime un groupe
 */
export async function deleteGroup(id: string) {
    try {
        // Note: Prisma will handle the relation. If Horse has groupId nullable, it sets it to NULL.
        await db.group.delete({
            where: { id },
        });
        revalidatePath("/horses");
        revalidatePath("/settings/groups");
        return { success: true };
    } catch (error) {
        console.error("Erreur lors de la suppression du groupe:", error);
        return { success: false, error: "Impossible de supprimer le groupe (vérifiez s'il reste des chevaux rattachés)" };
    }
}

/**
 * Récupère tous les professionnels
 */
export async function getProviders() {
    try {
        const providers = await db.provider.findMany({
            include: {
                specialty: true,
            },
            orderBy: {
                name: "asc",
            },
        });
        return providers;
    } catch (error) {
        console.error("Erreur lors de la récupération des professionnels:", error);
        return [];
    }
}

/**
 * Crée un nouveau professionnel
 */
export async function createProvider(formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const specialtyId = formData.get("specialtyId") as string;

        if (!name || !specialtyId) {
            throw new Error("Le nom et la spécialité sont requis");
        }

        const provider = await db.provider.create({
            data: {
                name,
                phone,
                specialtyId,
            },
        });

        revalidatePath("/providers");
        revalidatePath("/");

        return { success: true, provider };
    } catch (error) {
        console.error("Erreur lors de la création du professionnel:", error);
        return { success: false, error: "Impossible de créer le professionnel" };
    }
}

/**
 * Met à jour un professionnel existant
 */
export async function updateProvider(providerId: string, formData: FormData) {
    try {
        const name = formData.get("name") as string;
        const phone = formData.get("phone") as string;
        const specialtyId = formData.get("specialtyId") as string;

        if (!name || !specialtyId) {
            throw new Error("Le nom et la spécialité sont requis");
        }

        const provider = await db.provider.update({
            where: { id: providerId },
            data: {
                name,
                phone,
                specialtyId,
            },
        });

        revalidatePath("/providers");
        revalidatePath("/");

        return { success: true, provider };
    } catch (error) {
        console.error("Erreur lors de la mise à jour du professionnel:", error);
        return { success: false, error: "Impossible de modifier le professionnel" };
    }
}

/**
 * Supprime un professionnel
 */
export async function deleteProvider(id: string) {
    try {
        await db.provider.delete({
            where: { id },
        });
        revalidatePath("/providers");
        revalidatePath("/");
        return { success: true };
    } catch (error) {
        console.error("Erreur lors de la suppression du professionnel:", error);
        return { success: false, error: "Impossible de supprimer le professionnel" };
    }
}

/**
 * Récupère toutes les spécialités
 */
export async function getSpecialties() {
    try {
        const specialties = await db.specialty.findMany({
            orderBy: {
                name: "asc",
            },
        });
        return specialties;
    } catch (error) {
        console.error("Erreur lors de la récupération des spécialités:", error);
        return [];
    }
}

/**
 * Crée une nouvelle spécialité
 */
export async function createSpecialty(name: string) {
    try {
        const specialty = await db.specialty.create({
            data: { name },
        });
        revalidatePath("/providers");
        revalidatePath("/settings/specialties");
        return { success: true, specialty };
    } catch (error) {
        console.error("Erreur lors de la création de la spécialité:", error);
        return { success: false, error: "Impossible de créer la spécialité" };
    }
}

/**
 * Met à jour une spécialité
 */
export async function updateSpecialty(id: string, name: string) {
    try {
        const specialty = await db.specialty.update({
            where: { id },
            data: { name },
        });
        revalidatePath("/providers");
        revalidatePath("/settings/specialties");
        return { success: true, specialty };
    } catch (error) {
        console.error("Erreur lors de la modification de la spécialité:", error);
        return { success: false, error: "Impossible de modifier la spécialité" };
    }
}

/**
 * Supprime une spécialité
 */
export async function deleteSpecialty(id: string) {
    try {
        await db.specialty.delete({
            where: { id },
        });
        revalidatePath("/providers");
        revalidatePath("/settings/specialties");
        return { success: true };
    } catch (error) {
        console.error("Erreur lors de la suppression de la spécialité:", error);
        return { success: false, error: "Impossible de supprimer la spécialité (vérifiez s'il reste des professionnels rattachés)" };
    }
}
