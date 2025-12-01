"use client";

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { getRequest } from "@/lib/actions/toysAction";
import { useQuery } from "@tanstack/react-query";
import { UserAvatar } from "../UserAvatar";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const ToyRequest = ({ id }: { id: string }) => {
  const { data : requests } = useQuery({
    queryKey: ["toyRequest", id],
    queryFn: () => getRequest(id),
  });

  return (
    <Accordion
      type="single"
      collapsible
      className="w-full"
      defaultValue="item-1"
    >
      <AccordionItem value="item-1">
        <AccordionTrigger>Requests {requests.data.giftRequests.length}</AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          {requests.data.giftRequests.map((request: any) => (
            <div
              key={request.id}
              className="flex items-center justify-between gap-2"
            >
              <div className="flex flex-row items-center gap-2">
                <UserAvatar
                  userId={request.user.id}
                  alt={request.user.name}
                  src={request.user.imageUrl}
                  showStatus={false}
                />
                <p>{request.user.name}</p>
              </div>
              <Button className="bg-green-600 hover:bg-green-700"> Select </Button>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ToyRequest;
