// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar variables de entorno (opcional, ya que usamos -r dotenv/config)
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.condition.createMany({
    data: [
      { name: 'new', description: 'New', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'like_new', description: 'Like New', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'acceptable', description: 'Acceptable', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'to_repair', description: 'To Repair', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true }
    ]
  });

  await prisma.status.createMany({
    data: [
      { name: 'available', description: 'Available', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'reserved', description: 'Reserved', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'sold', description: 'Sold', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'canceled', description: 'Canceled', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true }
    ]
  });

  await prisma.category.createMany({
    data: [
      { name: 'educational', description: 'Educational', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'electronic', description: 'Electronic', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'board games', description: 'Board games', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'camping', description: 'Camping', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true }
    ]
  });

}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });