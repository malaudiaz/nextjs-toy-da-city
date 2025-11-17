import MessageInfo from "@/components/shared/profile/Messagesinfo";
import MessageInfoSkeleton from "@/components/shared/profile/MessageInfoSkeleton"; // 1. Importa el Skeleton
import TitleBreakcrumbs from "@/components/shared/TitleBreakcrum";
import React, { Suspense } from "react"; // 2. Importa Suspense
import { getMessages } from "@/lib/actions/toysAction";

// 3. Componente async que realiza el fetching
const MessagesContent = async ({ messagesPromise }: { messagesPromise: ReturnType<typeof getMessages> }) => {
  // Espera a que la promesa de datos se resuelva
  const messages = await messagesPromise;

  return <MessageInfo messages={messages} />;
};

// 4. El Page Component se convierte en el contenedor de Suspense
const MessagesPage = async () => {
  // La función getMessages() devuelve una Promesa.
  const messagesPromise = getMessages();

  return (
    <div className="max-w-7xl mx-auto min-h-screen bg-background">
      <div className="px-5 py-3">
        <TitleBreakcrumbs translationScope="messages" />
      </div>
      
      {/* 5. Envuelve el contenido lento con Suspense */}
      <Suspense fallback={<MessageInfoSkeleton />}>
        {/* Pasamos la Promesa al componente Content */}
        <MessagesContent messagesPromise={messagesPromise} />
      </Suspense>
    </div>
  );
};

export default MessagesPage;