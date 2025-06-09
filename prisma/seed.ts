// prisma/seed.ts
import { PrismaClient } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar variables de entorno (opcional, ya que usamos -r dotenv/config)
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.condition.createMany({
    data: [
      { name: 'new', description: 'New', userId: 'foo', isActive: true },
      { name: 'like_new', description: 'Like New', userId: 'foo', isActive: true },
      { name: 'acceptable', description: 'Acceptable', userId: 'foo', isActive: true },
      { name: 'to_repair', description: 'To Repair', userId: 'foo', isActive: true }
    ]
  });

  await prisma.status.createMany({
    data: [
      { name: 'available', description: 'Available', userId: 'foo', isActive: true },
      { name: 'reserved', description: 'Reserved', userId: 'foo', isActive: true },
      { name: 'sold', description: 'Sold', userId: 'foo', isActive: true },
      { name: 'canceled', description: 'Canceled', userId: 'foo', isActive: true }
    ]
  });

  await prisma.category.createMany({
    data: [
      { name: 'educational', description: 'Educational', userId: 'foo', isActive: true },
      { name: 'electronic', description: 'Electronic', userId: 'foo', isActive: true },
      { name: 'board games', description: 'Board games', userId: 'foo', isActive: true },
      { name: 'camping', description: 'Camping', userId: 'foo', isActive: true }
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