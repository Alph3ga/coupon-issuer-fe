"use client"

import { Button } from "@/components/ui/button"
import { Menu } from "lucide-react"
import { useState } from "react"
import Link from "next/link"
import AdminMobileDrawer from "@/components/admin-mobile-drawer"

export default function AdminNavbar() {
  const [open, setOpen] = useState(false)

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="text-lg font-bold">Admin Dashboard</div>

      {/* Desktop menu */}
      <div className="hidden sm:flex gap-4">
        <Button asChild variant="ghost">
          <Link href="/admin">Dashboard</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/admin/templates">Templates</Link>
        </Button>
        <Button asChild variant="ghost">
          <Link href="/admin/coupons">Coupons</Link>
        </Button>

      </div>

      {/* Mobile menu button */}
      <div className="sm:hidden">
        <Menu className="h-6 w-6" onClick={() => setOpen(true)} />
      </div>

      <AdminMobileDrawer open={open} setOpen={setOpen} />
    </nav>
  )
}
