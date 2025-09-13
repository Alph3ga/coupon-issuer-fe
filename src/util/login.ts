// utils/api.ts
import Cookies from "js-cookie";
import { jwtDecode } from "jwt-decode";

import { UserClaims } from "./types";

import { API_BASE_URL } from "@/constants";

import axios, { AxiosError } from "axios";

export interface AuthResponse{
    success: boolean,
    message: string
}

function storeToken(token: string) {
    try {
      const claims = jwtDecode<UserClaims>(token);
      const expires = new Date(claims.exp * 1000);
  
      Cookies.set("token", token, {
        expires,
        sameSite: "strict",
        secure: process.env.NODE_ENV === "production",
      });
    } catch (err) {
      console.error("Failed to decode token", err);
    }
  }
  
  // Signup request
  export async function signup(data: {
    flat_number: string;
    password: string | null;
    email: string | null;
  }): Promise<AuthResponse> {
    try {
      const res = await axios.post(`${API_BASE_URL}/signup/`, data, {
        headers: { "Content-Type": "application/json" },
      });
  
      const { token } = res.data;
      storeToken(token);
  
      return {
        success: true,
        message: "Signup successful",
      };
    } catch (err: unknown) {
      console.error("Signup failed", err);
      const axiosError = err as AxiosError<{ detail: string }>;
      return {
        success: false,
        message: axiosError.response?.data?.detail || "Unknown Signup error",
      };
    }
  }
  
  // Login request
  export async function login(data: {
    flat_number: string;
    password: string;
  }): Promise<AuthResponse> {
    try {
      const res = await axios.post(`${API_BASE_URL}/login/`, data, {
        headers: { "Content-Type": "application/json" },
      });
  
      const { token_type, access_token } = res.data;
      console.log(access_token)
      console.log(res.data)
      storeToken(access_token);
  
      return {
        success: true,
        message: "Login successful",
      };
    } catch (err) {
        console.error("Login failed", err);
        const axiosError = err as AxiosError<{ detail: string }>;
        return {
          success: false,
          message: axiosError.response?.data?.detail || "Unknown Login error",
        };
    }
  }
  
  // Clear session
  export function logout() {
    Cookies.remove("token");
  }