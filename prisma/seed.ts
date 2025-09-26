// prisma/seed.ts
import { PrismaClient, FileType } from "@prisma/client";
//import { OrderStatus } from "@prisma/client";
import dotenv from "dotenv";

dotenv.config();

const prisma = new PrismaClient();

async function main() {
  await prisma.$transaction(async () => {
    // === LIMPIEZA ===
    // Eliminar en orden inverso por relaciones
    
    await prisma.refund.deleteMany();
    await prisma.transfer.deleteMany();
    await prisma.orderItem.deleteMany();
    await prisma.order.deleteMany();
    await prisma.review.deleteMany();
    await prisma.message.deleteMany();
    await prisma.pushSubscription.deleteMany();
    await prisma.favoriteToy.deleteMany();
    
    await prisma.media.deleteMany();
    await prisma.toy.deleteMany();
    await prisma.translation.deleteMany();
    await prisma.language.deleteMany();
    await prisma.category.deleteMany();
    await prisma.condition.deleteMany();
    await prisma.status.deleteMany();
    await prisma.user.deleteMany();


  });

  await prisma.$transaction(async (tx) => {
    // === IDIOMAS ===
    await tx.language.createMany({
      data: [
        { id: "en", code: "en", name: "English" },
        { id: "es", code: "es", name: "Español" },
        { id: "fr", code: "fr", name: "Francés" },
      ],
      skipDuplicates: true,
    });

    // === USUARIOS ===
    await tx.user.createMany({
      data: [
        {
          id: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
          name: "Miraidys Garcia Tornes",
          email: "mgt@gmail.com",
          phone: "52889836",
          clerkId: "user_2xMoqaxDWhsUmKjITZbWHRJMo8Z",
          role: "buyer",
        },
      ],
      skipDuplicates: true,
    });

    // === CONDICIONES ===
    await tx.condition.create({
      data: {
        id: 1,
        name: "new_sealed",
        description: "New sealed",
        userId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        translations: {
          create: [
            { key: "name", value: "New sealed", languageId: "en" },
            { key: "name", value: "Nuevo - sellado", languageId: "es" },
            { key: "name", value: "Neuf - scellé", languageId: "fr" },
          ],
        },
      },
    });

    await tx.condition.create({
      data: {
        id: 2,
        name: "new_open_box",
        description: "New open box",
        userId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        translations: {
          create: [
            { key: "name", value: "New open box", languageId: "en" },
            { key: "name", value: "Nuevo - Caja abierta", languageId: "es" },
            { key: "name", value: "Nouvelle boîte ouverte", languageId: "fr" },
          ],
        },
      },
    });

    await tx.condition.create({
      data: {
        id: 3,
        name: "like_new",
        description: "Like new",
        userId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        translations: {
          create: [
            { key: "name", value: "like_new", languageId: "en" },
            { key: "name", value: "Como nuevo", languageId: "es" },
            { key: "name", value: "comme_nouvea", languageId: "fr" },
          ],
        },
      },
    });

    await tx.condition.create({
      data: {
        id: 4,
        name: "acceptable",
        description: "Acceptable",
        userId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        translations: {
          create: [
            { key: "name", value: "acceptable", languageId: "en" },
            { key: "name", value: "Aceptable", languageId: "es" },
            { key: "name", value: "Acceptable", languageId: "fr" },
          ],
        },
      },
    });

    await tx.condition.create({
      data: {
        id: 5,
        name: "good",
        description: "Good",
        userId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        translations: {
          create: [
            { key: "name", value: "Good", languageId: "en" },
            { key: "name", value: "Bueno", languageId: "es" },
            { key: "name", value: "Bien", languageId: "fr" },
          ],
        },
      },
    });

    await tx.condition.create({
      data: {
        id: 6,
        name: "to_repair",
        description: "To repair",
        userId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        translations: {
          create: [
            { key: "name", value: "To repair", languageId: "en" },
            { key: "name", value: "Para reparar", languageId: "es" },
            { key: "name", value: "à_réparer", languageId: "fr" },
          ],
        },
      },
    });

    // === ESTADOS ===
    await tx.status.create({
      data: {
        id: 1,
        name: "available",
        description: "available",
        userId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        translations: {
          create: [
            { key: "name", value: "Available", languageId: "en" },
            { key: "name", value: "Disponible", languageId: "es" },
            { key: "name", value: "Disponible", languageId: "fr" },
          ],
        },
      },
    });

    await tx.status.create({
      data: {
        id: 2,
        name: "reserved",
        description: "Reserved",
        userId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        translations: {
          create: [
            { key: "name", value: "Reserved", languageId: "en" },
            { key: "name", value: "Reservado", languageId: "es" },
            { key: "name", value: "Réservée", languageId: "fr" },
          ],
        },
      },
    });

    await tx.status.create({
      data: {
        id: 3,
        name: "sold",
        description: "Sold",
        userId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        translations: {
          create: [
            { key: "name", value: "Sold", languageId: "en" },
            { key: "name", value: "Vendido", languageId: "es" },
            { key: "name", value: "Vendue", languageId: "fr" },
          ],
        },
      },
    });

    await tx.status.create({
      data: {
        id: 4,
        name: "canceled",
        description: "Canceled",
        userId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        translations: {
          create: [
            { key: "name", value: "Canceled", languageId: "en" },
            { key: "name", value: "Cancelado", languageId: "es" },
            { key: "name", value: "Annulé", languageId: "fr" },
          ],
        },
      },
    });

    // === CATEGORÍAS ===
    const categories = [
      "educational",
      "electronic",
      "board_games",
      "mobility",
      "for_babies",
      "stuffed_animals",
      "rare_toys",
      "action_figures",
      "vintage",
    ];

    for (const [index, name] of categories.entries()) {
      await tx.category.create({
        data: {
          id: index + 1,
          name,
          description: name,
          userId: "user_2xMoqaxDWhsUmKjITZbWHRJMo8Z",
          translations: {
            create: [
              { key: "name", value: name.replace("_", " "), languageId: "en" },
              {
                key: "name",
                value:
                  name === "educational"
                    ? "Educacional"
                    : name === "electronic"
                    ? "Electrónicos"
                    : name === "board_games"
                    ? "Juegos de mesa"
                    : name === "mobility"
                    ? "Movilidad"
                    : name === "for_babies"
                    ? "Para Bebes"
                    : name === "stuffed_animals"
                    ? "Peluches"
                    : name === "rare_toys"
                    ? "Juguetes Raros"
                    : name === "action_figures"
                    ? "Figuras de acción"
                    : name === "vintage"
                    ? "Antigua"
                    : name,
                languageId: "es",
              },
              {
                key: "name",
                value:
                  name === "educational"
                    ? "Pédagogique"
                    : name === "electronic"
                    ? "Électronique"
                    : name === "board_games"
                    ? "Jeux de société"
                    : name === "mobility"
                    ? "Mobilité"
                    : name === "for_babies"
                    ? "Pour les bébés"
                    : name === "stuffed_animals"
                    ? "Peluches"
                    : name === "rare_toys"
                    ? "Jouets rares"
                    : name === "action_figures"
                    ? "Figurines d'action"
                    : name === "vintage"
                    ? "Ancienne"
                    : name,
                languageId: "fr",
              },
            ],
          },
        },
      });
    }
  });

  // === JUGUETES Y MEDIOS ===
  await prisma.$transaction(async (tx) => {
    const toysData = [
      {
        id: "toy_001",
        title:
          "3 Pack Airplane Launcher Toys,",
        description:
          "**2 in 1 Airplane Toys - Our glider boy toy is equipped with 3 different colors of green, orange, and blue gliding foam planes, and 1 plane launcher. By throwing planes by hand or flying them with the launcher, kids can cultivate their hand-eye coordination, observation, and sense of direction ***Safe & Fun for Play - This foam airplane is made of molded foam, lightweight, safe, bendable, and will not harm kids' hands or feet, and comes with colorful LED lights, so kids can enjoy the fun of flying toys even at night. It allows your child to leave the video game, relax with friends and family, and enjoy a good outdoor time ***3 Fun Ways To Play - Foam glider-led plans can not only use the airplane launcher to achieve flight, but also can be thrown airplane toys into the sky and ground manually, or slid by hand boys toys. This plane brings endless fun to children, and outdoor toys and more novel ways to play are waiting for you to discover! In addition, glider planes for kids have no restrictions on the launch site, you can play indoors and outdoors! ***Catapult Plane Toys Accessories - Foam airplanes for kids include 3-pack airplanes and 1 launcher. Come with colorful LED lights, so kids can enjoy the fun no matter day or night for outdoor activities, and will increase their interest in flying. Airplane size: 9.33 x 8.66 in, Launcher size: 10.03 x 4.52 in ***✈Ideal Kids Gifts: Best birthday Christmas gift for 4-8 years of boys girls. Also, this will be a cool glider plane for kids, it is a good choice for toy gifts for kids on Easter, Christmas, Halloween, Thanksgiving Day, New Year, etc., Or being party favors for aviation and airplane themes, birthdays",
        price: 9.99,
        categoryId: 1,
        statusId: 1,
        conditionId: 1,
        location: "",
        sellerId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        forSell: true,
        forGifts: false,
        forChanges: false,
        isActive: true,
      },
      {
        id: "toy_002",
        title: "Loftus Surprise Hand Buzzer",
        description: "",
        price: 7.99,
        categoryId: 2,
        statusId: 1,
        conditionId: 1,
        location: "",
        sellerId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        forSell: true,
        forGifts: false,
        forChanges: false,
        isActive: true,
      },
      {
        id: "toy_003",
        title: "MV Akkey Second Hand Chew Hobby Goods",
        description:
          "I'll swap it for some small, decent-sounding Bluetooth speakers.",
        price: 0.0,
        location: "41.235433,-95.993834",
        categoryId: 2,
        statusId: 1,
        conditionId: 3,
        sellerId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        forSell: false,
        forGifts: false,
        forChanges: true,
        isActive: true,
      },
      {
        id: "toy_004",
        title: "Lot of 100 Used US United States Postage Stamps",
        description:
          "100 Exciting United States Stamps in Fine Used Condition. Includes Commemoratives and Large Pictorials only. Absolutely no duplicates.",
        price: 0.0,
        categoryId: 3,
        statusId: 1,
        conditionId: 2,
        location: "",
        sellerId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        forSell: false,
        forGifts: true,
        forChanges: false,
        isActive: true,
      },
      {
        id: "toy_005",
        title: "Green Sprouts Glass Sip And Straw Cup, Pink",
        description: "A great sturdy sippy cup!",
        price: 0.0,
        categoryId: 5,
        statusId: 1,
        conditionId: 1,
        location: "",
        sellerId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        forSell: false,
        forGifts: true,
        forChanges: false,
        isActive: true,
      },
      {
        id: "toy_006",
        title:
          'Playmates Teenage Mutant Ninja Turtles Tmnt Ghostbusters 6.5" Four Used Figures',
        description: "",
        price: 67.32,
        categoryId: 1,
        statusId: 1,
        conditionId: 4,
        location: "",
        sellerId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        forSell: true,
        forGifts: false,
        forChanges: false,
        isActive: true,
      },
      {
        id: "toy_007",
        title: "Metal toy army military tanks",
        description: "they all need a paint job",
        price: 32.99,
        location: "41.235433,-95.993834",
        categoryId: 2,
        statusId: 1,
        conditionId: 5,
        sellerId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        forSell: true,
        forGifts: false,
        forChanges: false,
        isActive: true,
      },
      {
        id: "toy_008",
        title:
          "Easy-to-read Ben 10 analog watch for boys with a silver case and green faux leather.",
        description:
          "It doesn't work, probably just the battery. I'm swap it for the 3.75' Ben 10 Ultimate Alien HUMUNGOUSAUR Action Figure",
        price: 0.0,
        categoryId: 8,
        statusId: 1,
        conditionId: 6,
        location: "",
        sellerId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        forSell: false,
        forGifts: false,
        forChanges: true,
        isActive: true,
      },
      {
        id: "toy_009",
        title:
          "UNOFFICIAL Plants vs Zombies PvZ Plush Stuffed Toy 10 Piece Set Second Hand Used",
        description: "",
        price: 19.99,
        categoryId: 6,
        statusId: 1,
        conditionId: 5,
        location: "",
        sellerId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        forSell: true,
        forGifts: false,
        forChanges: false,
        isActive: true,
      },
      {
        id: "toy_010",
        title: 'Pedimini 16" Kids MTB Style Bicycle Bike',
        description:
          "Very good condition mechanically and aesthetically. Low rise bar for an MTB feel. A few scuffs and scratches on the frame are barely noticeable.",
        price: 49.99,
        categoryId: 4,
        statusId: 1,
        conditionId: 3,
        location: "",
        sellerId: "f1c5d8b2-e4b3-a9f1-c5d8-b2e4b3a9f1c5",
        forSell: true,
        forGifts: false,
        forChanges: false,
        isActive: true,
      },
    ];

    await tx.toy.createMany({
      data: toysData,
      skipDuplicates: true,
    });

    // === MEDIOS ===
    const mediaData = [
      {
        id: "media_001",
        fileUrl: "/images/f1.jpg",
        type: FileType.IMAGE,
        toyId: "toy_001",
      },
      {
        id: "media_002",
        fileUrl: "/images/f1-2.jpg",
        type: FileType.IMAGE,
        toyId: "toy_001",
      },
      {
        id: "media_003",
        fileUrl: "/images/f1-3.jpg",
        type: FileType.IMAGE,
        toyId: "toy_001",
      },
      {
        id: "media_004",
        fileUrl: "/images/f1-4.jpg",
        type: FileType.IMAGE,
        toyId: "toy_001",
      },
      {
        id: "media_005",
        fileUrl: "/images/f1-5.jpg",
        type: FileType.IMAGE,
        toyId: "toy_001",
      },
      {
        id: "media_006",
        fileUrl: "/images/f2.jpg",
        type: FileType.IMAGE,
        toyId: "toy_002",
      },
      {
        id: "media_007",
        fileUrl: "/images/f2-1.jpg",
        type: FileType.IMAGE,
        toyId: "toy_002",
      },
      {
        id: "media_008",
        fileUrl: "/images/f3.jpg",
        type: FileType.IMAGE,
        toyId: "toy_003",
      },
      {
        id: "media_009",
        fileUrl: "/images/f3-2.jpg",
        type: FileType.IMAGE,
        toyId: "toy_003",
      },
      {
        id: "media_010",
        fileUrl: "/images/f3-3.jpg",
        type: FileType.IMAGE,
        toyId: "toy_003",
      },
      {
        id: "media_011",
        fileUrl: "/images/f4.jpg",
        type: FileType.IMAGE,
        toyId: "toy_004",
      },
      {
        id: "media_012",
        fileUrl: "/images/f5.webp",
        type: FileType.IMAGE,
        toyId: "toy_005",
      },
      {
        id: "media_013",
        fileUrl: "/images/f5-2.webp",
        type: FileType.IMAGE,
        toyId: "toy_005",
      },
      {
        id: "media_014",
        fileUrl: "/images/f5-3.webp",
        type: FileType.IMAGE,
        toyId: "toy_005",
      },
      {
        id: "media_015",
        fileUrl: "/images/f6.webp",
        type: FileType.IMAGE,
        toyId: "toy_006",
      },
      {
        id: "media_016",
        fileUrl: "/images/f6-2.webp",
        type: FileType.IMAGE,
        toyId: "toy_006",
      },
      {
        id: "media_017",
        fileUrl: "/images/f6-3.webp",
        type: FileType.IMAGE,
        toyId: "toy_006",
      },
      {
        id: "media_018",
        fileUrl: "/images/f7.webp",
        type: FileType.IMAGE,
        toyId: "toy_007",
      },
      {
        id: "media_019",
        fileUrl: "/images/f7-2.webp",
        type: FileType.IMAGE,
        toyId: "toy_007",
      },
      {
        id: "media_020",
        fileUrl: "/images/f7-3.webp",
        type: FileType.IMAGE,
        toyId: "toy_007",
      },
      {
        id: "media_021",
        fileUrl: "/images/f7-4.webp",
        type: FileType.IMAGE,
        toyId: "toy_007",
      },
      {
        id: "media_022",
        fileUrl: "/images/f7-5.webp",
        type: FileType.IMAGE,
        toyId: "toy_007",
      },
      {
        id: "media_023",
        fileUrl: "/images/f8.webp",
        type: FileType.IMAGE,
        toyId: "toy_008",
      },
      {
        id: "media_024",
        fileUrl: "/images/f8-2.webp",
        type: FileType.IMAGE,
        toyId: "toy_008",
      },
      {
        id: "media_025",
        fileUrl: "/images/f8-3.webp",
        type: FileType.IMAGE,
        toyId: "toy_008",
      },
      {
        id: "media_026",
        fileUrl: "/images/f8-4.webp",
        type: FileType.IMAGE,
        toyId: "toy_008",
      },
      {
        id: "media_027",
        fileUrl: "/images/f9.webp",
        type: FileType.IMAGE,
        toyId: "toy_009",
      },
      {
        id: "media_028",
        fileUrl: "/images/f9-2.webp",
        type: FileType.IMAGE,
        toyId: "toy_009",
      },
      {
        id: "media_029",
        fileUrl: "/images/f9-3.webp",
        type: FileType.IMAGE,
        toyId: "toy_009",
      },
      {
        id: "media_030",
        fileUrl: "/images/f10.webp",
        type: FileType.IMAGE,
        toyId: "toy_010",
      },
      {
        id: "media_031",
        fileUrl: "/images/f10-2.webp",
        type: FileType.IMAGE,
        toyId: "toy_010",
      },
      {
        id: "media_032",
        fileUrl: "/images/f10-3.webp",
        type: FileType.IMAGE,
        toyId: "toy_010",
      },
      {
        id: "media_033",
        fileUrl: "/images/f10-4.webp",
        type: FileType.IMAGE,
        toyId: "toy_010",
      },
      {
        id: "media_034",
        fileUrl: "/images/f10-5.webp",
        type: FileType.IMAGE,
        toyId: "toy_010",
      },
    ];

    await tx.media.createMany({
      data: mediaData,
      skipDuplicates: true,
    });

    // === ORDENES ===
    
/*     const ordersData = [
      {
        id: "14bc658a-1ced-4064-982a-e7abc7a804c0",
        cartId: "cart_user_31l2iT5aSDptUZiJxwB3UnVrek5_1756479343980",
        paymentIntentId: "pi_3S1TiPB2uRwXvuGM1lDlNQfY",
        chargeId: "ch_3S1TiPB2uRwXvuGM11YgG1QZ",
        buyerId: "0f1a4b4d-da45-493a-a218-da7cb511198f",
        sellerId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        totalAmount: 4298,
        status: OrderStatus.AWAITING_CONFIRMATION,
      },
      {
        id: "254d2ed9-caec-4718-b328-cdeb4d3cb4d2",
        cartId: "cart_user_31l2iT5aSDptUZiJxwB3UnVrek5_1756483400317",
        paymentIntentId: "pi_3S1UlpB2uRwXvuGM1XvFM219",
        chargeId: "ch_3S1UlpB2uRwXvuGM19oUvhpp",
        buyerId: "0f1a4b4d-da45-493a-a218-da7cb511198f",
        sellerId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        totalAmount: 999,
        status: OrderStatus.AWAITING_CONFIRMATION,
      },
      {
        id: "98f692ee-f72f-4957-88a8-9751f9a43ac0",
        cartId: "cart_user_31l2iT5aSDptUZiJxwB3UnVrek5_1756483394795",
        paymentIntentId: "pi_3S1UlkB2uRwXvuGM0Ys3nBPq",
        chargeId: "",
        buyerId: "0f1a4b4d-da45-493a-a218-da7cb511198f",
        sellerId: "f47ac10b-58cc-4372-a567-0e02b2c3d479",
        totalAmount: 999,
        status: OrderStatus.AWAITING_CONFIRMATION,
      },
    ];


    await tx.order.createMany({
      data: ordersData,
      skipDuplicates: true,
    });
 */
    // === OrderItem ===
/*     const orderItemsData = [
      {
        id: "39f9e9b4-910f-4d70-bb6a-21b4be13f2f4",
        orderId: "14bc658a-1ced-4064-982a-e7abc7a804c0",
        toyId: "toy_007",
        priceAtPurchase: 3299,
      },
      {
        id: "4510f594-2406-4697-ab4e-fd45d7b29921",
        orderId: "14bc658a-1ced-4064-982a-e7abc7a804c0",
        toyId: "toy_001",
        priceAtPurchase: 999,
      },
      {
        id: "51491afc-b3e1-4fb4-aa83-aebd6fa75603",
        orderId: "254d2ed9-caec-4718-b328-cdeb4d3cb4d2",
        toyId: "toy_001",
        priceAtPurchase: 999,
      },
      {
        id: "a77e827f-c093-4805-8fb5-095be6b7f9c2",
        orderId: "98f692ee-f72f-4957-88a8-9751f9a43ac0",
        toyId: "toy_001",
        priceAtPurchase: 999,
      },
    ];

    await tx.orderItem.createMany({
      data: orderItemsData,
      skipDuplicates: true,
    });
 */
    // === FAVORITES ===
/*     const favoritesData = [
      {
        id: "favorite_001",
        userId: "0f1a4b4d-da45-493a-a218-da7cb511198f",
        toyId: "toy_005",
      },
      {
        id: "favorite_002",
        userId: "0f1a4b4d-da45-493a-a218-da7cb511198f",
        toyId: "toy_006",
      },
    ];

    await tx.favoriteToy.createMany({
      data: favoritesData,
      skipDuplicates: true,
    });
 */
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
