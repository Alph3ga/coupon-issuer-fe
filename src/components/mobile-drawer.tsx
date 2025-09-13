"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import Cookies from "js-cookie";
import { logout } from "@/util/login";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { getUserId } from "@/util/auth";

export default function MobileDrawer({
  open,
  setOpen,
}: {
  open: boolean;
  setOpen: (o: boolean) => void;
}) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();

  useEffect(() => {
    setIsLoggedIn(!!Cookies.get("token"));
  }, []);

  const handleNav = (path: string) => {
    router.push(path);
    setOpen(false);
  };

  const handleLogout = () => {
    logout();
    setIsLoggedIn(false);
    setOpen(false);
    router.push("/login");
  };

  return (
    <div
      className={`fixed top-0 right-0 h-full w-64 bg-white shadow-lg transform transition-transform duration-300 z-50
        ${open ? "translate-x-0" : "translate-x-full"}`}
    >
      <div className="flex justify-between items-center p-4 border-b">
        <span className="font-bold">Menu</span>
        <X className="h-6 w-6 cursor-pointer" onClick={() => setOpen(false)} />
      </div>

      <div className="flex flex-col p-4 gap-4">
        {isLoggedIn &&
        <Button variant="ghost" onClick={() => handleNav("/mycoupons"+getUserId())}>
          My Coupons
        </Button>
        }
        {isLoggedIn &&
        <Button variant="ghost" onClick={() => handleNav("/book")}>
          Book Coupons
        </Button>
        }
        <Button variant="ghost" onClick={() => handleNav("/contact")}>
          Contact Us
        </Button>

        {isLoggedIn ? (
          <Button variant="outline" onClick={handleLogout}>
            Logout
          </Button>
        ) : (
          <Button variant="default" onClick={() => handleNav("/login")}>
            Login
          </Button>
        )}
      </div>
    </div>
  );
}

