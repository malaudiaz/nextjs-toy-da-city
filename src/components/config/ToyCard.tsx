// app/config/toys/ToyCard.tsx


import { Card, CardContent } from '../ui/card';
import { Button } from '../ui/button';
import { Edit } from 'lucide-react';
import { Toy } from '@/types/modelTypes';

type ToyCardProps = {
    toy: Toy
}

export default function ToyCard({ toy }: ToyCardProps) {
  return (
   <Card className="overflow-hidden bg-gradient-card shadow-card hover:shadow-card-hover transition-all duration-300">
      <CardContent className="p-0">
        <div className="flex">
          <div className="w-32 h-32 flex-shrink-0">
            <img
              src={toy.media[0].fileUrl || ""}
              alt={toy.title}
              className="w-full h-full object-cover transition-transform duration-300 hover:scale-105"
            />
          </div>
          <div className="flex-1 p-4 flex items-center justify-between">
            <div className="space-y-2 flex-1 mr-4">
              <h3 className="font-bold text-lg text-card-foreground">
                {toy.title}
              </h3>
              <p className="text-muted-foreground text-sm line-clamp-1">
                {toy.description}
              </p>
              <span className="text-xl font-bold bg-gradient-primary bg-clip-text text-transparent">
                ${toy.price}
              </span>
            </div>
            <Button
              size="sm"
              className="bg-gradient-accent hover:shadow-lg transition-all duration-300"
            >
              <Edit className="w-4 h-4 mr-2" />
              Editar
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}