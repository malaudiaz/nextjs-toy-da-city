// app/chat/page.tsx (o donde lo estés usando)

import { getOnlineUsers } from "@/lib/actions/getUserActions";

async function ChatPage() {
  const { users } = await getOnlineUsers();

  // Función para obtener la inicial del nombre
  const getInitial = (name: string | null | undefined) => {
    return name ? name.charAt(0).toUpperCase() : "?";
  };

  return (
    <div className="flex flex-col max-w-4xl mx-auto border rounded-lg overflow-hidden p-4">

      {/* Contenedor del carrusel */}
      <div className="overflow-x-auto pb-2 hide-scrollbar">
        <div className="flex flex-row gap-4 min-w-max">
          {users.length === 0 ? (
            <p className="text-gray-500">No hay usuarios online</p>
          ) : (
            users.map((user) => (
              <div
                key={user.clerkId}
                className="flex-shrink-0 flex flex-col items-center w-20 sm:w-16 md:w-20"
              >
                {/* Avatar circular */}
                <div className="w-12 h-12 sm:w-10 sm:h-10 md:w-12 md:h-12 rounded-full bg-blue-500 text-white flex items-center justify-center text-lg font-medium">
                  {getInitial(user.name)}
                </div>
                {/* Nombre */}
                <p className="text-xs sm:text-xs md:text-sm mt-1 text-center truncate w-full px-1">
                  {user.name || "Anónimo"}
                </p>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default ChatPage;