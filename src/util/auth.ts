import { jwtDecode } from "jwt-decode";
import { UserClaims } from "./types";
import Cookies from "js-cookie";

export function getToken(): string | null {
  if (typeof window === "undefined") return null; // SSR guard
  return Cookies.get("token") || null; 
}

export function getClaims(): UserClaims | null {
  const token = getToken();
  if (!token) return null;

  try {
    return jwtDecode<UserClaims>(token);
  } catch (err) {
    console.error("Invalid token", err);
    return null;
  }
}

export function getFlatNumber(): string | null {
  return getClaims()?.flat_number ?? null;
}

export function isAdmin(): boolean {
  return getClaims()?.is_admin ?? false;
}

export function getUserId(): string | null {
  return getClaims()?.user_id ?? null;
}
