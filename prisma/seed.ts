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
    ],
    skipDuplicates: true,
  });

  await prisma.status.createMany({
    data: [
      { name: 'available', description: 'Available', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true }, 
      { name: 'reserved', description: 'Reserved', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'sold', description: 'Sold', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'canceled', description: 'Canceled', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true }
    ],
    skipDuplicates: true,
  });

  await prisma.category.createMany({
    data: [
      { name: 'educational', description: 'Educational', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'electronic', description: 'Electronic', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'board games', description: 'Board games', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'camping', description: 'Camping', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'dolls', description: 'Dolls', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { name: 'stuffed_animals', description: 'Stuffed animals', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true }
    ],
    skipDuplicates: true,
  });

  await prisma.toy.createMany({
    data: [
      { title: 'Barbie', description: 'Beautiful barbie', price: 5.00, location:'', categoryId: 1, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: true, isActive: true},
      { title: 'bicycles', description: 'Bicycles', price: 0.00, location:'', categoryId:4, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: false, forGifts: true, forChanges: false, isActive: true},
      { title: 'domino', description: 'Domino', price: 3.00, location:'', categoryId:3, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: true, isActive: true},
      { title: 'chess', description: 'Chess', price: 0.00, location:'', categoryId:2, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: false, forGifts: true, forChanges: false, isActive: true},
      { title: 'chess big', description: 'Chess Big', price: 10.00, location:'', categoryId:2, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true}
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