"use client";

import { Button } from "@/components/ui/button";
import { Menu } from "lucide-react";
import { useState, useEffect } from "react";
import MobileDrawer from "@/components/mobile-drawer";
import Cookies from "js-cookie";
import { logout } from "@/util/login";
import Link from "next/link";
import { getUserId } from "@/util/auth";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userId, setUserId] = useState<string|null>(null)

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("token"));
    setUserId(getUserId())
  }, []);

  return (
    <nav className="flex items-center justify-between p-4 border-b">
      <div className="text-lg font-bold">Lakewood Pujo Food Coupons</div>

      {/* Desktop menu */}
      <div className="hidden sm:flex gap-4 items-center">
      {isLoggedIn &&
        <Button variant="ghost"><Link href={'/mycoupons/'+userId}>My Coupons</Link></Button>
      }
      {isLoggedIn &&
        <Button variant="ghost"><Link href="/book">Book Coupons</Link></Button>
      }
        <Button variant="ghost">Contact Us</Button>
        {isLoggedIn ? (
          <Button variant="outline" onClick={() => { logout(); location.reload(); }}>
            Logout
          </Button>
        ) : (
          <Button variant="default">Login</Button>
        )}
      </div>

      {/* Mobile menu button */}
      <div className="sm:hidden">
        <Menu className="h-6 w-6" onClick={() => setOpen(true)} />
      </div>

      <MobileDrawer open={open} setOpen={setOpen} />
    </nav>
  );
}
