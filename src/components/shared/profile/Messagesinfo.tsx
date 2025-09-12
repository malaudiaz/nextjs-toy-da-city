import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import { Package } from "lucide-react";

type Media = {
  id: string;
  fileUrl: string;
  type: "IMAGE" | "VIDEO";
  toyId: string;
  createdAt?: Date;
  updatedAt?: Date;
};

type MessageSender = {
  id: string;
  name: string;
  email: string;
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
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
  media: Media[];
  messageSenders: MessageSender[];
};

type MessagesProps = {
  messages: Messages[];
};

const MessagesInfo = async ({ messages }: MessagesProps) => {
  return (
    <div className="min-h-screen p-4 md:p-6">
      <div className="mb-8 flex items-center justify-between">
        <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2">
          Mensajes Recibidos por Juguetes
        </h1>
      </div>

      <div className="space-y-6">
        {messages.length === 0 ? (
          <Card className="bg-white/80 backdrop-blur-sm border-0 shadow-lg">
            <CardContent className="p-8 text-center">
              <Package className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                No se encontraron ventas con los filtros seleccionados
              </p>
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
                        <div className="text-2xl font-bold text-blue-600">
                          ${msg.price.toFixed(2)}
                        </div>
                      </div>
                    </div>

                    <Separator />
                    <div className="flex flex-col gap-2">
                      <p className="text-lg text-gray-600">{msg.description}</p>
                    </div>
                    <Separator />

                    <div className="flex flex-col gap-2">
                      <div className="flex flex-col gap-2">
                        {msg.messageSenders.map((sender) => (
                          <div
                            key={sender.id}
                            className="p-4 bg-gray-100 rounded-lg"
                          >
                            <h4 className="text-md font-semibold text-gray-800">
                              {sender.name}
                            </h4>
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
  );
};
export default MessagesInfo;
