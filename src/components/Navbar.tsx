"use client"
import { signOut, useSession } from "next-auth/react"
import Link from "next/link"
import { Button } from "./ui/button"

export default function Navbar() {
  const { data: session } = useSession()
  return (
    <nav className="py-4 md:py-6 shadow-md bg-gray-900 text-white">
      <div className="container mx-auto flex flex-row justify-between items-center">
        <a href="/" className="text-xl font-bold">
          Mystery Message
        </a>
        {session ? (
          <Button
            onClick={() => signOut()}
            className="w-auto bg-red-600 text-white border-none"
            variant="outline"
          >
            Logout
          </Button>
        ) : (
          <Link href="/sign-in">
            <Button
              className="w-full md:w-auto bg-slate-100 text-black"
              variant={"outline"}
            >
              Login
            </Button>
          </Link>
        )}
      </div>
    </nav>
  )
}
