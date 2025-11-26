"use client";

import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { User } from "lucide-react";
import Link from "next/link";
import { ChatButton } from "../ChatButton";
import { FavoriteToy } from "@prisma/client";
import { useTranslations } from "next-intl"; // ✅ Importa el hook
import Empty from "../Empty";

type Media = {
  id: string;
  fileUrl: string;
  type: "IMAGE" | "VIDEO";
  toyId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type MessageSender = {
  id: string; // ID de Prisma (id de la tabla 'users')
  fullName: string;
  imageUrl: string;
  clerkId: string;
  email: string;
  phone: string;
  role: string; // Incluir el rol para la validación/información
  reputation: number;
  reviewsCount: number; // Cantidad total de reseñas recibidas
};

type Messages = {
  id: string;
  title: string;
  description: string;
  price: number;
  location: string;
  categoryId: number;
  statusId: number;
  conditionId: number;
  sellerId: string;
  forSell: boolean;
  forGifts: boolean;
  forChanges: boolean;
  isFavorite: boolean;
  favorites: FavoriteToy[];
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  media: Media[];
  messageSenders: MessageSender[];
  categoryDescription: string;
  conditionDescription: string;
  statusDescription: string;
};

type MessagesProps = {
  messages: Messages[];
};

const MessagesInfo = ({ messages }: MessagesProps) => {
  const t = useTranslations("messages");

  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
            {t("title")}
          </h1>
        </div>

        <div className="space-y-6">
          {messages.length === 0 ? (
            <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
              <CardContent className="p-8 text-center">
                <Empty title={t("title")} subtitle={t("emptyMsg")} />
              </CardContent>
            </Card>
          ) : (
            messages.map((msg) => (
              <Card
                key={msg.id}
                className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
              >
                <CardContent>
                  <div className="flex flex-col lg:flex-row gap-6">
                    <div className="flex-shrink-0">
                      <Image
                        src={msg.media[0].fileUrl || "/placeholder.svg"}
                        alt={msg.title}
                        width={150}
                        height={150}
                        className="rounded-lg object-cover w-full lg:w-[150px] h-[150px]"
                      />
                    </div>

                    <div className="flex-1 space-y-4">
                      <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                        <div>
                          <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            {msg.title}
                          </h3>
                        </div>
                        <div className="flex flex-col items-end gap-2">
                          <div className="text-2xl font-bold text-green-700">
                            {msg.price === 0 ? (
                              <span className="bg-green-700 text-white px-3 py-1 rounded-lg font-bold shadow-sm">
                                {t("free")}
                              </span>
                            ) : (
                              `$${msg.price.toFixed(2)}`
                            )}
                          </div>
                        </div>
                      </div>

                      <Separator />
                      <div className="flex flex-col gap-2">
                        <p className="text-lg text-gray-600">
                          {msg.description}
                        </p>
                      </div>
                      <Separator />

                      <div className="flex flex-col gap-2">
                        <div className="flex flex-col gap-2">
                          {msg.messageSenders.map((sender) => (
                            <div
                              key={sender.id}
                              className="flex flex-col gap-2"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center gap-2 text-sm text-gray-600">
                                  <User className="h-4 w-4" />
                                  <span>
                                    {t("buyer")}:{" "}
                                    <Link href={`/seller/${sender.id}`}>
                                      {sender.fullName}
                                    </Link>
                                  </span>
                                </div>

                                <ChatButton toy={msg} seller={sender} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
export default MessagesInfo;
