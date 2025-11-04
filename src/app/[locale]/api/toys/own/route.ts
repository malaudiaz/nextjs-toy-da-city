import { auth } from "@clerk/nextjs/server";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";
import { getTranslations } from "next-intl/server";


export async function GET(
  req: Request,
  { params }: { params: Promise<{ locale: string }> }
) {
  let { userId } = await auth();
  const g = await getTranslations("General");

  if (!userId) {
    userId = req.headers.get("X-User-ID");
  }

  if (userId) {
    const user = await prisma.user.findUnique({ where: { clerkId: userId } });
    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: g("UserNotFound"),
        },
        { status: 404 }
      );
    } else {
      userId = user.id;
    }
  }

  const { locale } = await params;

  const userLanguageCode = locale;

  const t = await getTranslations("Toy");

  try {
    const toy = await prisma.toy.findMany({
      where: { sellerId: userId! },
      include: {
        media: true,
        category: {
          include: {
            translations: {
              where: { languageId: userLanguageCode, key: "name" },
              select: { value: true },
            },
          },
        },
        condition: {
          include: {
            translations: {
              where: { languageId: userLanguageCode, key: "name" },
              select: { value: true },
            },
          },
        },
        status: {
          include: {
            translations: {
              where: { languageId: userLanguageCode, key: "name" },
              select: { value: true },
            },
          },
        },
      }
    });

    if (!toy) {
      return NextResponse.json({ error: t("ToyNotFound") }, { status: 404 });
    }

    return NextResponse.json(toy);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { error: g("ServerError") },
      { status: 500 }
    );
  }
}
