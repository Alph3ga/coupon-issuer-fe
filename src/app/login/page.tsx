"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import Cookies from "js-cookie";
import { login, signup, AuthResponse } from "@/util/login";
import { toast } from "sonner"

import { API_BASE_URL } from "@/constants";

export default function AuthPage() {
  const [flat, setFlat] = useState("");
  const [password, setPassword] = useState("");
  const [reenterPassword, setReenterPassword] = useState("");
  const [email, setEmail] = useState("");
  const router = useRouter();

  const handleLogin = async () => {
    const response= await login({flat_number: flat, password});
    if(response.success){
      toast.success("Login successful!", {
        description: "Welcome back.",
        duration: 1000,
        dismissible: true,
      });
      router.refresh()
      router.push("/");
    }
    else{
      toast.error("Login failed.", {
        description: response.message,
        duration: 3000,
        dismissible: true,
      });
    }
  };

  const handleSignup = async () => {
    try {
      const res = await signup({flat_number: flat, password, email})

      if (res.success) {
        toast.success("Signup successful!", {
          description: "Welcome.",
          duration: 1000,
          dismissible: true,
        });
        router.refresh()
        router.push("/");
      } else {
        toast.error("Login failed.", {
          description: res.message,
          duration: 3000,
          dismissible: true,
        });
      }
    } catch (err) {
      console.error("Signup error", err);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <Card className="w-full max-w-sm shadow-lg rounded-2xl">
        <CardHeader>
          <CardTitle className="text-center text-xl">Welcome</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="login" className="w-full">
            <TabsList className="grid grid-cols-2 w-full mb-4">
              <TabsTrigger value="login">Login</TabsTrigger>
              <TabsTrigger value="signup">Signup</TabsTrigger>
            </TabsList>

            {/* Login Form */}
            <TabsContent value="login">
              <div className="space-y-3">
                <Input
                  placeholder="Flat Number"
                  type="text"
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Button className="w-full" onClick={handleLogin}>
                  Login
                </Button>
              </div>
            </TabsContent>

            {/* Signup Form */}
            <TabsContent value="signup">
              <div className="space-y-3">
                <Input
                  placeholder="Flat Number"
                  type="text"
                  value={flat}
                  onChange={(e) => setFlat(e.target.value)}
                />
                <Input
                  placeholder="Email (optional)"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <Input
                  placeholder="Password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <Input
                  placeholder="Re-enter password"
                  type="password"
                  value={reenterPassword}
                  onChange={(e) => setReenterPassword(e.target.value)}
                />
                <Button className="w-full" onClick={handleSignup}>
                  Signup
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
        <CardFooter className="text-xs text-gray-500 justify-center">
          <p>You need a password if you are signing in as an Admin.</p>
        </CardFooter>
      </Card>
    </div>
  );
}
