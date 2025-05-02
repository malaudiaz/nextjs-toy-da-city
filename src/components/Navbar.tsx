"use client"

import Link from "next/link"
import { signIn } from "next-auth/react"

function Navbar() {
  return (
    <nav className="bg-slate-900 flex justify-between items-center px-24 text-white py-3">
        <Link href={"/"}>
            <h1>NextGoogle</h1>
        </Link>

        <div className="flex items-center gap-x-2">
            <Link href={"/dashboard"}>
                Dashboard
            </Link>
            <button onClick={() => signIn()} className="bg-sky-400 px-3 py-2 rounded">Sign in</button>
        </div>
    </nav>
  )
}

export default Navbar
