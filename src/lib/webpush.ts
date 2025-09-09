// lib/webpush.ts
import webPush from 'web-push'

console.log('🔧 Configurando VAPID...')
console.log('🔑 Pública:', process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY ? 'OK' : 'FALTA')
console.log('🔐 Privada:', process.env.VAPID_PRIVATE_KEY ? 'OK' : 'FALTA')

// ⚠️ Esta línea es la clave: sin ella, NO HAY HEADER VAPID
webPush.setVapidDetails(
  'mailto:contacto@tuapp.com', // subject (puede ser cualquier correo tuyo)
  process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!,
  process.env.VAPID_PRIVATE_KEY!
)

export default webPush