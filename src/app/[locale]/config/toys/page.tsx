import ToyGrid from '@/components/config/ToyGrid';
import React from 'react'



const ToysPage = async () => {
  return (
  <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold bg-gradient-primary bg-clip-text text-transparent mb-4">
            Mis Juguetes en Venta
          </h1>
          <p className="text-muted-foreground text-lg">
            Gestiona tu inventario de juguetes de forma fácil y atractiva
          </p>
        </div>

        <ToyGrid />
      </div>
    </div>
  )
}

export default ToysPage
