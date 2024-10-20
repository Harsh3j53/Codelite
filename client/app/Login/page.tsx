"use client";
import { useState, FormEvent } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

import {
  signInWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
} from "firebase/auth";
import { setPersistence, browserLocalPersistence } from "firebase/auth";
import { auth } from "@/Firebase";
import { useRouter } from "next/navigation";

export default function Login() {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  // Handle Email/Password Login
  const handleLogin = async (e: FormEvent) => {
    e.preventDefault();
    setError(null);

    try {
      // Set persistence to 'local' explicitly (default behavior)
      await setPersistence(auth, browserLocalPersistence);

      // Now proceed to sign in the user
      await signInWithEmailAndPassword(auth, email, password);
      router.push("/IDE"); // Redirect after successful login
    } catch (err: any) {
      setError(err.message); // Handle and display error
    }
  };

  // Handle Google Sign-in
  const handleGoogleLogin = async () => {
    const provider = new GoogleAuthProvider();

    try {
      await signInWithPopup(auth, provider);
      router.push("/IDE"); // Redirect after successful Google login
    } catch (err: any) {
      setError(err.message); // Handle and display error
    }
  };

  return (
    <div className="w-full h-screen flex items-center justify-center bg-black">
      <Card className="mx-auto max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Login</CardTitle>
          <CardDescription>
            Enter your email below to login to your account
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="m@example.com"
                required
              />
            </div>
            <div className="grid gap-2">
              <div className="flex items-center">
                <Label htmlFor="password">Password</Label>
                <Link
                  href="#"
                  className="ml-auto inline-block text-sm underline"
                >
                  Forgot your password?
                </Link>
              </div>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {error && <p className="text-red-500">{error}</p>}

            <Button type="submit" className="w-full">
              Login
            </Button>
          </form>
          <Button
            variant="outline"
            className="w-full mt-4"
            onClick={handleGoogleLogin}
          >
            Login with Google
          </Button>
          <div className="mt-4 text-center text-sm">
            Don&apos;t have an account?{" "}
            <Link href="/signup" className="underline">
              Sign up
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
