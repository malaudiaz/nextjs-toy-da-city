import { Twitter, Facebook, Youtube, Instagram } from 'lucide-react'
import Link from 'next/link'
import React from 'react'
import SelectLanguage from './SelectLanguage'

const TopNavbar = () => {
  return (
    <header className="bg-[#3D5D3C] w-full pt-2 border-b border-white/50">
    <div className="mx-auto max-w-7xl py-3 flex justify-between items-center border-white">
      <h3 className="text-white">
        Welcome to Toydacity: The Sustainable Toy Marketplace
      </h3>
      <div className="flex items-center justify-center gap-2">
        <p className="text-white text-sm">Follow us:</p>
        <div className="flex gap-x-1">
          <Link href="https://twitter.com/toydacity" className="text-white">
            <Twitter />
          </Link>
          <Link href="https://twitter.com/toydacity" className="text-white">
            <Facebook />
          </Link>
          <Link href="https://twitter.com/toydacity" className="text-white">
            <Youtube />
          </Link>
          <Link href="https://twitter.com/toydacity" className="text-white border-r border-white/30 pr-4">
            <Instagram />
          </Link>
          <SelectLanguage/>
        </div>
      </div>
    </div>
</header>
  )
}

export default TopNavbar
