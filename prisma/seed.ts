// prisma/seed.ts
import { PrismaClient, FileType } from '@prisma/client';
import dotenv from 'dotenv';

// Cargar variables de entorno (opcional, ya que usamos -r dotenv/config)
dotenv.config();

const prisma = new PrismaClient();
  
async function main() {


  await prisma.$transaction(async (tx) => {

    await prisma.translation.deleteMany()
    await prisma.language.deleteMany()
  
    await prisma.commentsLikes.deleteMany()
    await prisma.commentsComments.deleteMany()
    await prisma.toyLikes.deleteMany()
    await prisma.toyComments.deleteMany()
    await prisma.media.deleteMany()
    await prisma.toy.deleteMany()
  
    await prisma.category.deleteMany()
    await prisma.condition.deleteMany()
    await prisma.status.deleteMany()

    // language
    await prisma.language.createMany({
      data: [
        { id: 'en', code: 'en', name: 'English' },
        { id: 'es', code: 'es', name: 'Español' },
        { id: 'fr', code: 'fr', name: 'Francés' },
      ],
      skipDuplicates: true,
    })

    // users
    await prisma.user.createMany({
      data: [
        { id: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', name: 'Miguel Anegel Lau Díaz'},
        { id: 'user_2xMoqaxDWhsUmKjITZbWHRJMo8Z', name: 'Miraidys Garcia Tornes' }
      ],
      skipDuplicates: true,
    })

          
    // Nomenclador de Condiciones del Juguete
    await tx.condition.create({
      data: {
        id: 1, name: 'new_sealed', description: 'New sealed', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'New sealed', languageId: 'en'},
            {key: 'name', value: 'Nuevo - sellado', languageId: 'es' },
            {key: 'name', value: 'Neuf - scellé', languageId: 'fr'}]
        }
      }
    })

    await tx.condition.create({
      data: {
        id: 2, name: 'new_open_box', description: 'New open box', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'New open box', languageId: 'en'},
            {key: 'name', value: 'Nuevo - Caja abierta', languageId: 'es'},
            {key: 'name', value: 'Nouvelle boîte ouverte', languageId: 'fr'}]
        }
      }
    })

    await tx.condition.create({
      data: {
        id: 3, name: 'like_new', description: 'Like new',  userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'like_new', languageId: 'en'},
            {key: 'name', value: 'Como nuevo', languageId: 'es'},
            {key: 'name', value: 'comme_nouvea', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.condition.create({
      data: {
        id: 4, name: 'acceptable', description: 'Acceptable', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'acceptable', languageId: 'en'},
            {key: 'name', value: 'Aceptable', languageId: 'es'},
            {key: 'name', value: 'Acceptable', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.condition.create({
      data: {
        id: 5, name: 'good', description: 'Good', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Good', languageId: 'en'},
            {key: 'name', value: 'Bueno', languageId: 'es'},
            {key: 'name', value: 'Bien', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.condition.create({
      data: {
        id: 6, name: 'to_repair', description: 'To repair', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'To repair', languageId: 'en'},
            {key: 'name', value: 'Para reparar', languageId: 'es'},
            {key: 'name', value: 'à_réparer', languageId: 'fr'}
          ]
        }
      }
    })

    // Nomenclador de Estados del Juguete del Juguete
    await tx.status.create({
      data: {
        id: 1, name: 'available', description: 'available', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Available', languageId: 'en'},
            {key: 'name', value: 'Disponible', languageId: 'es'},
            {key: 'name', value: 'Disponible', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.status.create({
      data: {
        id: 2, name: 'reserved', description: 'Reserved', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Reserved', languageId: 'en'},
            {key: 'name', value: 'Reservado', languageId: 'es'},
            {key: 'name', value: 'Réservée', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.status.create({
      data: {
        id: 3, name: 'sold', description: 'Sold', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Sold', languageId: 'en'},
            {key: 'name', value: 'Vendido', languageId: 'es'},
            {key: 'name', value: 'Vendue', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.status.create({
      data: {
        id: 4, name: 'canceled', description: 'Canceled', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Canceled', languageId: 'en'},
            {key: 'name', value: 'Cancelado', languageId: 'es'},
            {key: 'name', value: 'Annulé', languageId: 'fr'}
          ]
        }
      }
    })


    // // Nomenclador de Categorias del Juguete
    await tx.category.create({
      data: {
        id: 1, name: 'educational', description: 'Educational',
        userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Educational', languageId: 'en'},
            {key: 'name', value: 'Educacional', languageId: 'es'},
            {key: 'name', value: 'Pédagogique', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.category.create({
      data: {
        id: 2, name: 'electronic', description: 'Electronic', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Electronic', languageId: 'en'},
            {key: 'name', value: 'Electrónicos', languageId: 'es'},
            {key: 'name', value: 'Électronique', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.category.create({
      data: {
        id: 3, name: 'board_games', description: 'Board games', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Board games', languageId: 'en'},
            {key: 'name', value: 'Juegos de mesa', languageId: 'es'},
            {key: 'name', value: 'Jeux de société', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.category.create({
      data: {
        id: 4, name: 'mobility', description: 'Mobility', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Mobility', languageId: 'en'},
            {key: 'name', value: 'Movilidad', languageId: 'es'},
            {key: 'name', value: 'Mobilité', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.category.create({
      data: {
        id: 5, name: 'for_babies', description: 'For babies', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'For babies', languageId: 'en'},
            {key: 'name', value: 'Para Bebes', languageId: 'es'},
            {key: 'name', value: 'Pour les bébés', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.category.create({
      data: {
        id: 6, name: 'stuffed_animals', description: 'Stuffed animals', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Stuffed animals', languageId: 'en'},
            {key: 'name', value: 'Peluches', languageId: 'es'},
            {key: 'name', value: 'Peluches', languageId: 'fr'}
          ]
        }
      }
    })

    
    await tx.category.create({
      data: {
        id: 7, name: 'rare_toys', description: 'Rare toys', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Rare Toys', languageId: 'en'},
            {key: 'name', value: 'Juguetes Raros', languageId: 'es'},
            {key: 'name', value: 'Jouets rares', languageId: 'fr'}
          ]
        }
      }
    })

    await tx.category.create({
      data: {
        id: 8, name: 'action_figures', description: 'Action Figures', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Action Figures', languageId: 'en'},
            {key: 'name', value: 'Figuras de acción', languageId: 'es'},
            {key: 'name', value: "Figurines d'action", languageId: 'fr'}
          ]
        }
      }
    })

    await tx.category.create({
      data: {
        id: 9, name: 'vintage', description: 'vintage', userId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x',
        translations: {
          create: [
            {key: 'name', value: 'Vintage', languageId: 'en'},
            {key: 'name', value: 'Antigua', languageId: 'es'},
            {key: 'name', value: 'Ancienne', languageId: 'fr'}
          ]
        }
      }
    })

  })

  await prisma.$transaction(async (tx) => {

    
    //Session de los Juguetes
    await prisma.toy.createMany({
    data: [
      { id: 'toy_001',
        title: '3 Pack Airplane Launcher Toys, 2 Flight Modes LED Foam Glider Catapult Plane, Outdoor Flying Toy for Kids, \
               Birthday Gifts for Boy Girl 6+ Year Old, B-Day Party Supplies', 
        description: "**2 in 1 Airplane Toys - Our glider boy toy is equipped with 3 different colors of green, \
                     orange, and blue gliding foam planes, and 1 plane launcher. By throwing planes by hand or flying them with \
                     the launcher, kids can cultivate their hand-eye coordination, observation, and sense of direction \
                     ***Safe & Fun for Play - This foam airplane is made of molded foam, lightweight, safe, bendable, \
                     and will not harm kids' hands or feet, and comes with colorful LED lights, so kids can enjoy the fun of flying toys even \
                     at night. It allows your child to leave the video game, relax with friends and family, and enjoy a good outdoor time \
                     ***3 Fun Ways To Play - Foam glider-led plans can not only use the airplane launcher to achieve flight, \
                     but also can be thrown airplane toys into the sky and ground manually, or slid by hand boys toys. \
                     This plane brings endless fun to children, and outdoor toys and more novel ways to play are waiting for you to discover! \
                     In addition, glider planes for kids have no restrictions on the launch site, you can play indoors and outdoors! \
                     ***Catapult Plane Toys Accessories - Foam airplanes for kids include 3-pack airplanes and 1 launcher. \
                     Come with colorful LED lights, so kids can enjoy the fun no matter day or night for outdoor activities, \
                     and will increase their interest in flying. Airplane size: 9.33 x 8.66 in, Launcher size: 10.03 x 4.52 in \
                     ***✈Ideal Kids Gifts: Best birthday Christmas gift for 4-8 years of boys girls. Also, \
                     this will be a cool glider plane for kids, it is a good choice for toy gifts for kids on Easter, Christmas, Halloween, \
                     Thanksgiving Day, New Year, etc., Or being party favors for aviation and airplane themes, birthdays  ", 
        price: 9.99, categoryId:1, statusId: 1, conditionId: 1, location:'',
        sellerId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true},
      { id: 'toy_002',
        title: 'Loftus Surprise Hand Buzzer', 
        description: '', 
        price: 7.99, categoryId:7, statusId: 1, conditionId: 1, location:'',
        sellerId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true},
      { id: 'toy_003', 
        title: 'MV Akkey Second Hand Chew Hobby Goods', 
        description: "I'll swap it for some small, decent-sounding Bluetooth speakers.", 
        price: 0.00, location:'41.235433,-95.993834', 
        categoryId: 2, statusId: 1, conditionId: 3, 
        sellerId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: false, forGifts: false, forChanges: true, isActive: true},
      { id: 'toy_004',
        title: 'Lot of 100 Used US United States Postage Stamps', 
        description: '100 Exciting United States Stamps in Fine Used Condition. Includes Commemoratives and Large Pictorials only. Absolutely no duplicates.', 
        price: 0.00, categoryId:3, statusId: 1, conditionId: 2, location:'',
        sellerId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: false, forGifts: true, forChanges: false, isActive: true},
      { id: 'toy_005',
        title: 'Green Sprouts Glass Sip And Straw Cup, Pink', 
        description: 'A great sturdy sippy cup!', 
        price: 0.00, categoryId:5, statusId: 1, conditionId: 1, location:'',
        sellerId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: false, forGifts: true, forChanges: false, isActive: true},
      { id: 'toy_006',
        title: 'Playmates Teenage Mutant Ninja Turtles Tmnt Ghostbusters 6.5" Four Used Figures', 
        description: '', 
        price: 67.32, categoryId:8, statusId: 1, conditionId: 4, location:'',
        sellerId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true},
      { id: 'toy_007', 
        title: 'Metal toy army military tanks', 
        description: 'they all need a paint job', 
        price: 32.99, location:'41.235433,-95.993834', 
        categoryId: 9, statusId: 1, conditionId: 5, 
        sellerId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true},  
      { id: 'toy_008',
        title: 'Easy-to-read Ben 10 analog watch for boys with a silver case and green faux leather.', 
        description: "It doesn't work, probably just the battery. I'm swap it for the 3.75' Ben 10 Ultimate Alien HUMUNGOUSAUR Action Figure", 
        price: 0.00, categoryId:8, statusId: 1, conditionId: 6, location:'',
        sellerId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: false, forGifts: false, forChanges: true, isActive: true},
      { id: 'toy_009',
        title: 'UNOFFICIAL Plants vs Zombies PvZ Plush Stuffed Toy 10 Piece Set Second Hand Used', 
        description: '', 
        price: 19.99, categoryId:6, statusId: 1, conditionId: 5, location:'',
        sellerId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true},
      { id: 'toy_010',
        title: 'Pedimini 16" Kids MTB Style Bicycle Bike', 
        description: "Very good condition mechanically and aesthetically. Low rise bar for an MTB feel. A few scuffs and scratches on the frame are barely noticeable.", 
        price: 49.99, categoryId:4, statusId: 1, conditionId: 3, location:'',
        sellerId: 'user_2wY8ZRoOrheojD7zQXtwk9fg00x', forSell: true, forGifts: false, forChanges: false, isActive: true},
  ],
    skipDuplicates: true,
  });

  await prisma.media.createMany({
    data: [
      {id: 'media_001', fileUrl: '/images/f1.jpg', type: FileType.IMAGE, toyId: 'toy_001'},
      {id: 'media_002', fileUrl: '/images/f1-2.jpg', type: FileType.IMAGE, toyId: 'toy_001'},
      {id: 'media_003', fileUrl: '/images/f1-3.jpg', type: FileType.IMAGE, toyId: 'toy_001'},
      {id: 'media_004', fileUrl: '/images/f1-4.jpg', type: FileType.IMAGE, toyId: 'toy_001'},
      {id: 'media_005', fileUrl: '/images/f1-5.jpg', type: FileType.IMAGE, toyId: 'toy_001'},
      {id: 'media_006', fileUrl: '/images/f2.jpg', type: FileType.IMAGE, toyId: 'toy_002'},
      {id: 'media_007', fileUrl: '/images/f2-1.jpg', type: FileType.IMAGE, toyId: 'toy_002'},
      {id: 'media_008', fileUrl: '/images/f3.jpg', type: FileType.IMAGE, toyId: 'toy_003'},
      {id: 'media_009', fileUrl: '/images/f3-2.jpg', type: FileType.IMAGE, toyId: 'toy_003'},
      {id: 'media_010', fileUrl: '/images/f3-3.jpg', type: FileType.IMAGE, toyId: 'toy_003'},
      {id: 'media_011', fileUrl: '/images/f4.jpg', type: FileType.IMAGE, toyId: 'toy_004'},
      {id: 'media_012', fileUrl: '/images/f5.webp', type: FileType.IMAGE, toyId: 'toy_005'},
      {id: 'media_013', fileUrl: '/images/f5-2.webp', type: FileType.IMAGE, toyId: 'toy_005'},
      {id: 'media_014', fileUrl: '/images/f5-3.webp', type: FileType.IMAGE, toyId: 'toy_005'},
      {id: 'media_015', fileUrl: '/images/f6.webp', type: FileType.IMAGE, toyId: 'toy_006'},
      {id: 'media_016', fileUrl: '/images/f6-2.webp', type: FileType.IMAGE, toyId: 'toy_006'},
      {id: 'media_017', fileUrl: '/images/f6-3.webp', type: FileType.IMAGE, toyId: 'toy_006'},
      {id: 'media_018', fileUrl: '/images/f7.webp', type: FileType.IMAGE, toyId: 'toy_007'},
      {id: 'media_019', fileUrl: '/images/f7-2.webp', type: FileType.IMAGE, toyId: 'toy_007'},
      {id: 'media_020', fileUrl: '/images/f7-3.webp', type: FileType.IMAGE, toyId: 'toy_007'},
      {id: 'media_021', fileUrl: '/images/f7-4.webp', type: FileType.IMAGE, toyId: 'toy_007'},
      {id: 'media_022', fileUrl: '/images/f7-5.webp', type: FileType.IMAGE, toyId: 'toy_007'},
      {id: 'media_023', fileUrl: '/images/f8.webp', type: FileType.IMAGE, toyId: 'toy_008'},
      {id: 'media_024', fileUrl: '/images/f8-2.webp', type: FileType.IMAGE, toyId: 'toy_008'},
      {id: 'media_025', fileUrl: '/images/f8-3.webp', type: FileType.IMAGE, toyId: 'toy_008'},
      {id: 'media_026', fileUrl: '/images/f8-4.webp', type: FileType.IMAGE, toyId: 'toy_008'},
      {id: 'media_027', fileUrl: '/images/f9.webp', type: FileType.IMAGE, toyId: 'toy_009'},
      {id: 'media_028', fileUrl: '/images/f9-2.webp', type: FileType.IMAGE, toyId: 'toy_009'},
      {id: 'media_029', fileUrl: '/images/f9-3.webp', type: FileType.IMAGE, toyId: 'toy_009'},
      {id: 'media_030', fileUrl: '/images/f10.webp', type: FileType.IMAGE, toyId: 'toy_010'},
      {id: 'media_031', fileUrl: '/images/f10-2.webp', type: FileType.IMAGE, toyId: 'toy_010'},
      {id: 'media_032', fileUrl: '/images/f10-3.webp', type: FileType.IMAGE, toyId: 'toy_010'},
      {id: 'media_033', fileUrl: '/images/f10-4.webp', type: FileType.IMAGE, toyId: 'toy_010'},
      {id: 'media_034', fileUrl: '/images/f10-5.webp', type: FileType.IMAGE, toyId: 'toy_010'},
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

  })
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });