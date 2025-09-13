"use client";

import { getUserId, isAdmin } from "@/util/auth";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function Home() {
  const router = useRouter();

  useEffect(() => {
    const user_id = getUserId();
    const is_admin = isAdmin();
    if (user_id) {
      if(is_admin) router.push("/admin");
      else router.push("/mycoupons/"+user_id);
    } else {
      router.push("/login");
    }
  }, [router]);

  return null;
}
