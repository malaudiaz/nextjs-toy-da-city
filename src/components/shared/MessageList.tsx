"use client";

import { UserAvatar } from "./UserAvatar";

interface Message {
  id: string;
  content: string;
  senderId: string;
  receiverId: string;
  createdAt: Date | string;
  sender: {
    clerkId: string;
    name: string | null;
    imageUrl?: string | null;
  };
  receiver: {
    clerkId: string;
    name: string | null;
    imageUrl?: string | null;
  };
}

type MessageListProps = {
  messages: Message[];
  currentUserId: string;
};

function getInitial(name: string | null | undefined): string {
  return name?.trim().charAt(0).toUpperCase() || "?";
}

/* function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return `hsl(${hue}, 70%, 60%)`
}
 */
export function MessageList({ messages, currentUserId }: MessageListProps) {
  return (
    <div className="flex flex-col gap-6 p-4 max-w-2xl mx-auto">
      {messages.map((message) => {
        const isCurrentUser = message.senderId === currentUserId;
        const initial = getInitial(message.sender.name);

        if (isCurrentUser) {
          // Mensaje del usuario actual - alineado a la derecha
          return (
            <div
              key={message.id}
              className="flex justify-end items-center gap-4"
            >
              <div className="relative max-w-xs md:max-w-md">
                <div className="bg-blue-100 border border-black rounded-3xl p-4 text-center shadow-lg relative">
                  <p className="text-base font-medium text-gray-800 leading-relaxed">
                    {message.content}
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-full">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-blue-100 relative -ml-1"></div>
                  <div className="w-0 h-0 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-black absolute top-0 left-0"></div>
                </div>
              </div>

              {message.sender.imageUrl ? (
                <UserAvatar
                  userId={message.sender.clerkId}
                  src={message.sender.imageUrl}
                  alt={
                    message.sender.name ? message.sender.name : "User Avatar"
                  }
                  showStatus={false}
                />
              ) : (
                <div className="bg-blue-100 border border-black rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-gray-800">
                    {initial}
                  </span>
                </div>
              )}
            </div>
          );
        } else {
          // Mensaje de otros usuarios - alineado a la izquierda
          return (
            <div key={message.id} className="flex items-center gap-4">
              {message.sender.imageUrl ? (
                <UserAvatar
                  userId={message.sender.clerkId}
                  src={message.sender.imageUrl}
                  alt={
                    message.sender.name ? message.sender.name : "User Avatar"
                  }
                  showStatus={false}
                />
              ) : (
                <div className="bg-gray-100 border border-black rounded-full w-10 h-10 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-bold text-gray-800">
                    {initial}
                  </span>
                </div>
              )}
              <div className="relative max-w-xs md:max-w-md">
                <div className="bg-gray-100 border border-black rounded-3xl p-4 text-center shadow-lg relative">
                  <p className="text-base font-medium text-gray-800 leading-relaxed">
                    {message.content}
                  </p>
                  <div className="text-xs text-gray-500 mt-2">
                    {new Date(message.createdAt).toLocaleTimeString([], {
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </div>
                </div>

                <div className="absolute left-0 top-1/2 transform -translate-y-1/2 -translate-x-full">
                  <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-gray-100 relative -mr-1"></div>
                  <div className="w-0 h-0 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-black absolute top-0 right-0"></div>
                </div>
              </div>
            </div>
          );
        }
      })}
    </div>
  );
}
