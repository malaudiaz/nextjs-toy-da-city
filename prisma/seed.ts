// prisma/seed.ts
import { PrismaClient, FileType } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar variables de entorno (opcional, ya que usamos -r dotenv/config)
dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.condition.createMany({
    data: [
      { id: 1, name: 'new', description: 'New', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { id: 2, name: 'like_new', description: 'Like New', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { id: 3, name: 'acceptable', description: 'Acceptable', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { id: 4, name: 'to_repair', description: 'To Repair', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true }
    ],
    skipDuplicates: true,
  });

  await prisma.status.createMany({
    data: [
      { id: 1, name: 'available', description: 'Available', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true }, 
      { id: 2, name: 'reserved', description: 'Reserved', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { id: 3, name: 'sold', description: 'Sold', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { id: 4, name: 'canceled', description: 'Canceled', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true }
    ],
    skipDuplicates: true,
  });

  await prisma.category.createMany({
    data: [
      { id: 1, name: 'educational', description: 'Educational', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { id: 2, name: 'electronic', description: 'Electronic', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { id: 3, name: 'board games', description: 'Board games', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { id: 4, name: 'camping', description: 'Camping', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { id: 5, name: 'dolls', description: 'Dolls', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true },
      { id: 6, name: 'stuffed_animals', description: 'Stuffed animals', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true }
    ],
    skipDuplicates: true,
  });

  await prisma.toy.createMany({
    data: [
      { id: 'toy_001', title: 'Barbie', description: 'Beautiful barbie', price: 5.00, location:'', categoryId: 5, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: true, isActive: true},     
      { id: 'toy_002',title: 'bicycles', description: 'Bicycles', price: 0.00, location:'', categoryId:4, statusId: 1, conditionId: 2, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: false, forGifts: true, forChanges: false, isActive: true},
      { id: 'toy_003',title: 'domino', description: 'Domino', price: 3.00, location:'', categoryId:3, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: true, isActive: true},
      { id: 'toy_004',title: 'chess', description: 'Chess', price: 0.00, location:'', categoryId:2, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: false, forGifts: true, forChanges: false, isActive: true},
      { id: 'toy_005',title: 'chess big', description: 'Chess Big', price: 10.00, location:'', categoryId:2, statusId: 1, conditionId: 3, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true}
    ],
    skipDuplicates: true,
  });

  await prisma.media.createMany({
    data: [
      {id: 'media_001', fileUrl: '/images/princess.png', type: FileType.IMAGE, toyId: 'toy_001'},
      {id: 'media_002', fileUrl: '/images/Casita.png', type: FileType.IMAGE, toyId: 'toy_001'},
      //{id: 'media_003', fileUrl: 'https://example.com/videos/switch.mp4', type: FileType.VIDEO, toyId: 'toy_002'},
    ],
    skipDuplicates: true,
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