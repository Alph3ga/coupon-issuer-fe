"use client"

import { X } from "lucide-react"
import { Button } from "@/components/ui/button"
import Link from "next/link"

export default function AdminMobileDrawer({
  open,
  setOpen,
}: {
  open: boolean
  setOpen: (o: boolean) => void
}) {
  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 ${
        open ? "translate-x-0" : "translate-x-full"
      }`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <span className="font-bold">Menu</span>
        <X className="h-6 w-6" onClick={() => setOpen(false)} />
      </div>

      <div className="flex flex-col p-4 gap-4">
        <Button asChild variant="ghost" onClick={() => setOpen(false)}>
          <Link href="/admin/users">Dashboard</Link>
        </Button>
        <Button asChild variant="ghost" onClick={() => setOpen(false)}>
          <Link href="/admin/users">Templates</Link>
        </Button>
        <Button asChild variant="ghost" onClick={() => setOpen(false)}>
          <Link href="/admin/coupons">Coupons</Link>
        </Button>
      </div>
    </div>
  )
}
