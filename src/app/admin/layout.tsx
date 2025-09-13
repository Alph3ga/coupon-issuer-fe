"use client"

import { ReactNode, useEffect } from "react"
import { useRouter } from "next/navigation"
import AdminNavbar from "@/components/admin-navbar"
import { getClaims } from "@/util/auth"
import { Toaster } from "sonner"

export default function AdminLayout({ children }: { children: ReactNode }) {
  const claims = getClaims()
  const router = useRouter()

  useEffect(() => {
    if (!claims?.is_admin) {
      router.push("/")
    }
  }, [claims, router])

  return (
    <html lang="en">
      <body>
        <AdminNavbar />
        <main className="p-4">{children}</main>
        <Toaster position="bottom-left"/>
      </body>
    </html>
  )
}
