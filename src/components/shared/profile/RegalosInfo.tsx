import React from 'react'
import Image from "next/image";
import { Card, CardContent } from '@/components/ui/card';
import { Calendar, Clock, Gift, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

type GiftsProps = {
    id: number;
    type: string;
    productName: string;
    price: number;
    image: string;
    recipient: string;
    sender: string;
    occasion: string;
    date: string;
    message: string;
    status: string
}
const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("es-ES", {
    year: "numeric",
    month: "long",
    day: "numeric",
  })
}

const RegalosInfo = ( { gifts }: { gifts: GiftsProps[] }) => {
  return (
   <div className="min-h-screen p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
              {gifts.map((gift) => (
                <Card
                  key={gift.id}
                  className="bg-white/80 backdrop-blur-sm border-0 shadow-lg hover:shadow-xl transition-shadow"
                >
                  <CardContent className="p-6 space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex items-center gap-2">
                        <Gift className={`h-5 w-5 ${gift.type === "sent" ? "text-blue-600" : "text-green-600"}`} />
                        <span className="text-sm font-medium">{gift.type === "sent" ? "Enviado" : "Recibido"}</span>
                      </div>
                    </div>

                    <div className="text-center space-y-3">
                      <Image
                        src={gift.image || "/placeholder.svg"}
                        alt={gift.productName}
                        width={120}
                        height={120}
                        className="rounded-lg object-cover w-[120px] h-[120px] mx-auto"
                      />
                      <h3 className="font-semibold text-gray-900">{gift.productName}</h3>
                    </div>

                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <User className="h-4 w-4" />
                        <span>{gift.type === "sent" ? `Para: ${gift.recipient}` : `De: ${gift.sender}`}</span>
                      </div>

                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Clock className="h-4 w-4" />
                        <span>{formatDate(gift.date)}</span>
                      </div>

                    </div>

                    <Button variant="outline" size="sm" className="w-full bg-transparent">
                      Ver Detalles
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
      </div>
    </div>
  )
}

export default RegalosInfo
