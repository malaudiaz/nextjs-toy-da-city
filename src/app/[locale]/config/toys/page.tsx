import ToyGrid from '@/components/config/ToyGrid';
import Breadcrumbs from '@/components/shared/BreadCrumbs';
import React from 'react'

const ToysPage = async () => {
  return (
  <div className="min-h-screen bg-background">
      <div className="container mx-auto max-w-7xl px-4 py-8">
        <Breadcrumbs/>
        <ToyGrid />
      </div>
    </div>
  )
}

export default ToysPage
