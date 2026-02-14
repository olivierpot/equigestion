import "dotenv/config"
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient({})

async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

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

    // Create admin user
    const adminPassword = await hashPassword('admin123')
    const admin = await prisma.user.create({
        data: {
            email: 'admin@equigestion.fr',
            password: adminPassword,
            name: 'Administrateur',
            role: 'ADMIN',
            isActive: true,
        },
    })
    console.log(`Admin created: ${admin.email}`)

    // Create a default manager
    const managerPassword = await hashPassword('manager123')
    const manager = await prisma.user.create({
        data: {
            email: 'manager@equigestion.fr',
            password: managerPassword,
            name: 'Gérant Haras',
            role: 'MANAGER',
            isActive: true,
        },
    })
    console.log(`Manager created: ${manager.email}`)

    // Create specialties (shared between all users)
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

    // Create groups (linked to manager)
    const groupA = await prisma.group.create({
        data: {
            name: 'Groupe A',
            userId: manager.id,
        },
    })

    const groupB = await prisma.group.create({
        data: {
            name: 'Groupe B',
            userId: manager.id,
        },
    })

    // Create owners (linked to manager)
    const owner1 = await prisma.owner.create({
        data: {
            name: 'Jean Dupont',
            email: 'jean.dupont@example.com',
            phone: '06 12 34 56 78',
            userId: manager.id,
        },
    })

    const owner2 = await prisma.owner.create({
        data: {
            name: 'Marie Curie',
            email: 'marie.curie@example.com',
            phone: '06 98 76 54 32',
            userId: manager.id,
        },
    })

    // Create horses (linked to manager)
    const horse1 = await prisma.horse.create({
        data: {
            name: 'Bella',
            breed: 'Selle Français',
            groupId: groupA.id,
            ownerId: owner1.id,
            foodRation: '3L Granulés matin/soir',
            userId: manager.id,
        },
    })

    const horse2 = await prisma.horse.create({
        data: {
            name: 'Jupiter',
            breed: 'Pur-sang',
            groupId: groupB.id,
            ownerId: owner2.id,
            foodRation: 'Foin à volonté',
            userId: manager.id,
        },
    })

    // Create providers (linked to manager)
    const vet = await prisma.provider.create({
        data: {
            name: 'Dr. Marc Vétérin',
            specialtyId: vetSpecialty.id,
            phone: '06 11 22 33 44',
            userId: manager.id,
        },
    })

    const farrier = await prisma.provider.create({
        data: {
            name: 'Jean Sabot',
            specialtyId: farrierSpecialty.id,
            phone: '06 55 66 77 88',
            userId: manager.id,
        },
    })

    // Create an appointment (linked to manager)
    await prisma.appointment.create({
        data: {
            date: new Date(new Date().setHours(9, 0, 0, 0)),
            type: 'FARRIER',
            providerId: farrier.id,
            horses: {
                connect: [{ id: horse1.id }, { id: horse2.id }],
            },
            status: 'PLANNED',
            userId: manager.id,
        },
    })

    console.log('Seed finished successfully!')
    console.log('')
    console.log('Credentials:')
    console.log('  Admin: admin@equigestion.fr / admin123')
    console.log('  Manager: manager@equigestion.fr / manager123')
}

main()
    .catch((e) => {
        console.error(e)
        process.exit(1)
    })
    .finally(async () => {
        await prisma.$disconnect()
    })
