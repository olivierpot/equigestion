import "dotenv/config"
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient({})

async function main() {
    console.log('Seed starting...')

    // Clean the database
    await prisma.medicalHistory.deleteMany()
    await prisma.medicalTracking.deleteMany()
    await prisma.healthEvent.deleteMany()
    await prisma.appointment.deleteMany()
    await prisma.provider.deleteMany()
    await prisma.specialty.deleteMany()
    await prisma.horse.deleteMany()
    await prisma.group.deleteMany()
    await prisma.owner.deleteMany()
    await prisma.user.deleteMany()

    // Create a default manager
    const manager = await prisma.user.create({
        data: {
            email: 'manager@equigestion.fr',
            name: 'Gérant Haras',
            role: 'MANAGER',
        },
    })

    // Create specialties
    const vetSpecialty = await prisma.specialty.create({
        data: { name: 'Vétérinaire' },
    })

    const farrierSpecialty = await prisma.specialty.create({
        data: { name: 'Maréchal-ferrant' },
    })

    const osteoSpecialty = await prisma.specialty.create({
        data: { name: 'Ostéopathe' },
    })

    const dentistSpecialty = await prisma.specialty.create({
        data: { name: 'Dentiste équin' },
    })

    // Create groups
    const groupA = await prisma.group.create({
        data: { name: 'Groupe A' },
    })

    const groupB = await prisma.group.create({
        data: { name: 'Groupe B' },
    })

    // Create owners
    const owner1 = await prisma.owner.create({
        data: {
            name: 'Jean Dupont',
            email: 'jean.dupont@example.com',
            phone: '06 12 34 56 78',
        },
    })

    const owner2 = await prisma.owner.create({
        data: {
            name: 'Marie Curie',
            email: 'marie.curie@example.com',
            phone: '06 98 76 54 32',
        },
    })

    // Create horses
    const horse1 = await prisma.horse.create({
        data: {
            name: 'Bella',
            breed: 'Selle Français',
            groupId: groupA.id,
            ownerId: owner1.id,
            foodRation: '3L Granulés matin/soir',
        },
    })

    const horse2 = await prisma.horse.create({
        data: {
            name: 'Jupiter',
            breed: 'Pur-sang',
            groupId: groupB.id,
            ownerId: owner2.id,
            foodRation: 'Foin à volonté',
        },
    })

    // Create providers
    const vet = await prisma.provider.create({
        data: {
            name: 'Dr. Marc Vétérin',
            specialtyId: vetSpecialty.id,
            phone: '06 11 22 33 44',
        },
    })

    const farrier = await prisma.provider.create({
        data: {
            name: 'Jean Sabot',
            specialtyId: farrierSpecialty.id,
            phone: '06 55 66 77 88',
        },
    })

    // Create an appointment
    await prisma.appointment.create({
        data: {
            date: new Date(new Date().setHours(9, 0, 0, 0)),
            type: 'FARRIER',
            providerId: farrier.id,
            horses: {
                connect: [{ id: horse1.id }, { id: horse2.id }],
            },
            status: 'PLANNED',
        },
    })

    console.log('Seed finished successfully!')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
