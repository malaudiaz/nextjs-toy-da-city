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
import { AcceptRequest } from "./AcceptRequest";
import { useTranslations } from "next-intl"; // ✅ Importa el hook

// ✅ Define types
interface User {
  id: string;
  name: string;
  imageUrl: string;
}

interface GiftRequest {
  id: string;
  user: User;
}

interface ToyRequestResponse {
  data: {
    giftRequests: GiftRequest[];
  };
}

const ToyRequest = ({ id, source }: { id: string, source: string }) => {
  const t = useTranslations(source); // o el namespace que uses
  const { data: requests, isLoading } = useQuery<ToyRequestResponse>({
    queryKey: ["toyRequest", id],
    queryFn: () => getRequest(id),
  });

  if (isLoading) {
    return <div>{t("loading")}</div>;
  }

  if (!requests?.data?.giftRequests) {
    return <div>{t("notFound")}</div>;
  }

  return (
    <Accordion type="single" collapsible className="w-full" defaultValue="item-1">
      <AccordionItem value="item-1">
        <AccordionTrigger>
          {t("request")} ({requests.data.giftRequests.length})
        </AccordionTrigger>
        <AccordionContent className="flex flex-col gap-4 text-balance">
          {requests.data.giftRequests.map((request) => (
            <div key={request.id} className="flex items-center justify-between gap-2">
              <div className="flex flex-row items-center gap-2">
                <UserAvatar
                  userId={request.user.id}
                  alt={request.user.name}
                  src={request.user.imageUrl}
                  showStatus={false}
                />
                <p>{request.user.name}</p>
              </div>
              <AcceptRequest id={request.id} source={source}/>
            </div>
          ))}
        </AccordionContent>
      </AccordionItem>
    </Accordion>
  );
};

export default ToyRequest;