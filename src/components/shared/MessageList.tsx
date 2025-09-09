'use client'

interface Message {
  id: string
  content: string
  senderId: string
  receiverId: string
  createdAt: Date | string
  sender: {
    clerkId: string
    name: string | null
  }
}

type MessageListProps = {
  messages: Message[]
  currentUserId: string
}

function getInitial(name: string | null | undefined): string {
  return name?.trim().charAt(0).toUpperCase() || '?'
}

function stringToColor(str: string): string {
  let hash = 0
  for (let i = 0; i < str.length; i++) {
    hash = str.charCodeAt(i) + ((hash << 5) - hash)
  }
  const hue = hash % 360
  return `hsl(${hue}, 70%, 60%)`
}

export function MessageList({ messages, currentUserId }: MessageListProps) {

  return (
    <div className="flex-1 p-4 overflow-y-auto bg-gray-50">
      {messages.length === 0 ? (
        <p className="text-center text-gray-500">No hay mensajes aún.</p>
      ) : (
        messages.map((msg) => {
          const isCurrentUser = msg.senderId === currentUserId
          const initial = getInitial(msg.sender.name)
          const bgColor = stringToColor(msg.sender.clerkId)

          return (
            <div
              key={msg.id}
              className={`flex items-start gap-1 pb-2 ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              {/* Avatar del remitente (izquierda si NO es el usuario actual) */}
              {!isCurrentUser && (
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm"
                  style={{ backgroundColor: bgColor }}
                >
                  {initial}
                </div>
              )}

              {/* Contenedor del mensaje */}
              <div
                className={`px-4 py-2 max-w-xs relative rounded-lg ${
                  isCurrentUser
                    ? 'bg-blue-400 text-white'
                    : 'bg-gray-200 text-gray-800 shadow'
                }`}
                style={{
                  // Aseguramos que el contenedor tenga posición relativa
                  position: 'relative',
                  // Bordes redondeados
                  borderTopLeftRadius: '0.375rem',
                  borderTopRightRadius: '0.375rem',
                  borderBottomLeftRadius: '0.375rem',
                  borderBottomRightRadius: '0.375rem',
                }}
              >
                {/* Nombre del remitente */}
                {!isCurrentUser && msg.sender.name && (
                  <div className="text-xs font-medium text-blue-500 mb-1">
                    {msg.sender.name}
                  </div>
                )}

                {/* Cuerpo del mensaje */}
                <div className="text-sm">{msg.content}</div>

                {/* Hora */}
                <div
                  className={`text-xs mt-1 opacity-80 ${isCurrentUser ? 'text-right' : 'text-left'}`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString([], {
                    hour: '2-digit',
                    minute: '2-digit',
                  })}
                </div>

              </div>

              {/* Avatar del usuario actual (derecha) */}
              {isCurrentUser && (
                <div
                  className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium shadow-sm"
                  style={{ backgroundColor: bgColor }}
                >
                  {initial}
                </div>
              )}
            </div>
          )
        })
      )}
    </div>
  )
}