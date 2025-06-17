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
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true},
      { id: 'toy_006', title: 'Teddy bear', description: 'Beautiful teddy bear', price: 15.00, location:'41.235433,-95.993834', 
        categoryId: 5, statusId: 1, conditionId: 3, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true},   
      { id: 'toy_007', title: 'Electric train', description: 'Beautiful electric train', price: 0.00, location:'', 
        categoryId: 2, statusId: 1, conditionId: 4, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: false, forGifts: false, forChanges: true, isActive: true},
      { id: 'toy_008', title: 'Doll house', description: 'Big doll house', price: 50.00, location:'41.235433,-95.993834', 
        categoryId: 5, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true},
      { id: 'toy_009', title: 'Ping pong game', description: 'ping pong game', price: 5.00, location:'41.235433,-95.993834', 
        categoryId: 3, statusId: 1, conditionId: 3, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true},
      { id: 'toy_010', title: 'Doll', description: 'Beautiful doll', price: 15.00, location:'41.235433,-95.993834', 
        categoryId: 5, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: true, isActive: true},  
      { id: 'toy_011', title: 'Black Doll', description: 'Beautiful doll', price: 0.00, location:'41.235433,-95.993834', 
        categoryId: 5, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: false, forGifts: true, forChanges: false, isActive: true},
      { id: 'toy_012', title: 'Blonde Doll', description: 'Beautiful doll', price: 10.00, location:'41.235433,-95.993834', 
        categoryId: 5, statusId: 1, conditionId: 1, 
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: true, forChanges: true, isActive: true},  
    ],
    skipDuplicates: true,
  });

  await prisma.media.createMany({
    data: [
      {id: 'media_001', fileUrl: '/images/princess.png', type: FileType.IMAGE, toyId: 'toy_001'},
      {id: 'media_002', fileUrl: '/images/Casita.png', type: FileType.IMAGE, toyId: 'toy_001'},
      {id: 'media_003', fileUrl: '/images/video_inicial.mp4', type: FileType.VIDEO, toyId: 'toy_001'},
      {id: 'media_004', fileUrl: '/images/Carros.png', type: FileType.IMAGE, toyId: 'toy_002'},
      {id: 'media_005', fileUrl: '/images/tren.png', type: FileType.IMAGE, toyId: 'toy_002'},
      {id: 'media_006', fileUrl: '/images/Domino.jpeg', type: FileType.IMAGE, toyId: 'toy_003'},
      {id: 'media_007', fileUrl: '/images/chess.jpeg', type: FileType.IMAGE, toyId: 'toy_004'},
      {id: 'media_008', fileUrl: '/images/chess.jpeg', type: FileType.IMAGE, toyId: 'toy_005'},
      {id: 'media_009', fileUrl: '/images/video_inicial.mp4', type: FileType.VIDEO, toyId: 'toy_005'},
      {id: 'media_010', fileUrl: '/images/osito.jpeg', type: FileType.IMAGE, toyId: 'toy_006'},
      {id: 'media_011', fileUrl: '/images/Peluches.png', type: FileType.IMAGE, toyId: 'toy_006'},
      {id: 'media_012', fileUrl: '/images/Casita.png', type: FileType.IMAGE, toyId: 'toy_006'},
      {id: 'media_013', fileUrl: '/images/tren.png', type: FileType.IMAGE, toyId: 'toy_007'},
      {id: 'media_014', fileUrl: '/images/Carros.png', type: FileType.IMAGE, toyId: 'toy_007'},
      {id: 'media_015', fileUrl: '/images/Casita.png', type: FileType.IMAGE, toyId: 'toy_008'},
      {id: 'media_016', fileUrl: '/images/ping_pong.jpeg', type: FileType.IMAGE, toyId: 'toy_009'},
      {id: 'media_017', fileUrl: '/images/video_inicial.mp4', type: FileType.VIDEO, toyId: 'toy_009'},
      {id: 'media_018', fileUrl: '/images/princess.png', type: FileType.IMAGE, toyId: 'toy_010'},
      {id: 'media_019', fileUrl: '/images/Casita.png', type: FileType.IMAGE, toyId: 'toy_010'},
      {id: 'media_020', fileUrl: '/images/video_inicial.mp4', type: FileType.VIDEO, toyId: 'toy_010'},
      {id: 'media_021', fileUrl: '/images/princess.png', type: FileType.IMAGE, toyId: 'toy_011'},
      {id: 'media_022', fileUrl: '/images/Casita.png', type: FileType.IMAGE, toyId: 'toy_011'},
      {id: 'media_023', fileUrl: '/images/princess.png', type: FileType.IMAGE, toyId: 'toy_012'},
    ],
    skipDuplicates: true,
  });

  await prisma.toyComments.createMany({
    data: [
      {id: 'comment_001', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'comment_002', summary: 'I Like', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'comment_003', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'comment_004', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'comment_005', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'comment_006', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'comment_007', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'comment_008', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'comment_009', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'comment_010', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'comment_011', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_002'},
      {id: 'comment_012', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_003'},
      {id: 'comment_013', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_004'},
      {id: 'comment_014', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_005'},
    ],
    skipDuplicates: true,
  });

  await prisma.toyLikes.createMany({
    data: [
      {id: 'like_001', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'like_002', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'like_003', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'like_004', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'like_005', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'like_006', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'like_007', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'like_008', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'like_009', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'like_010', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_001'},
      {id: 'like_011', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_002'},
      {id: 'like_012', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_003'},
      {id: 'like_013', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_004'},
      {id: 'like_014', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, toyId: 'toy_005'},
    ],
    skipDuplicates: true,
  });

  await prisma.commentsComments.createMany({
    data: [
      {id: 'comment_001', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'comment_002', summary: 'I Like', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'comment_003', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'comment_004', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'comment_005', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'comment_006', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'comment_007', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'comment_008', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_002'},
      {id: 'comment_009', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_002'},
      {id: 'comment_010', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_002'},
      {id: 'comment_011', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_003'},
      {id: 'comment_012', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_004'},
      {id: 'comment_013', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_004'},
      {id: 'comment_014', summary: 'Beautiful Toy', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_004'},
    ],
    skipDuplicates: true,
  });
  
  await prisma.commentsLikes.createMany({
    data: [
      {id: 'like_001', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'like_002', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'like_003', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'like_004', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'like_005', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'like_006', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'like_007', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'like_008', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'like_009', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_001'},
      {id: 'like_010', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_002'},
      {id: 'like_011', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_002'},
      {id: 'like_012', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_003'},
      {id: 'like_013', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_003'},
      {id: 'like_014', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', isActive: true, commentId: 'comment_003'},
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