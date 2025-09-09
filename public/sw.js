self.addEventListener('push', (event) => {
  // ✅ 1. Datos que vienen del push (payload)
  const payload = event.data?.json() // 👈 Renombrado a 'payload'

  // ✅ 2. Configuración de la notificación
  const title = payload?.title || 'Notificación'
  const options = {
    body: payload?.body || '',
    icon: payload?.icon || '/icon.png',
    data: payload?.data || { url: '/' }, // Usamos 'data' solo aquí, como parte del objeto options
  }

  // Mostrar notificación
  event.waitUntil(
    self.registration.showNotification(title, options)
  )
})

self.addEventListener('notificationclick', (event) => {
  // ✅ Accedemos a event.notification.data
  event.notification.close()

  const url = event.notification.data?.url || '/'
  event.waitUntil(
    clients.openWindow(url)
  )
})