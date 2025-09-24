import ToyGrid from '@/components/config/ToyGrid';
import Breadcrumbs from '@/components/shared/BreadCrumbs';
import React from 'react'



const ToysPage = async () => {
  return (
  <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs/>
        <div className="text-center mb-8">
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
