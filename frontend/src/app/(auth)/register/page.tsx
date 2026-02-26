"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function RegisterPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = Object.fromEntries(formData.entries());

    try {
      await api.post("/auth/register", data);
      localStorage.setItem("pending_username", data.username as string);
      
      // Set OTP cooldown for UI (5 minutes)
      const expiry = Date.now() + 5 * 60 * 1000;
      localStorage.setItem("otp_expiry", expiry.toString());

      router.push("/otp");
    } catch (err: any) {
      setError(err.response?.data?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4">
      <Card className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-serif font-bold text-center">Create account</CardTitle>
          <CardDescription className="text-center font-medium font-sans">
            Join Stockify to manage your inventory smarter
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4 font-sans">
            {error && (
              <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="full_name" className="text-sm font-bold">Full Name</Label>
              <Input id="full_name" name="full_name" placeholder="John Doe" required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="username" className="text-sm font-bold">Username</Label>
              <Input id="username" name="username" placeholder="johndoe" required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="phone_number" className="text-sm font-bold">Phone Number (WhatsApp)</Label>
              <Input id="phone_number" name="phone_number" placeholder="62812345678" required className="h-11" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-sm font-bold">Password</Label>
              <Input id="password" name="password" type="password" required className="h-11" />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4 font-sans">
            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? "Creating account..." : "Sign up"}
            </Button>
            <p className="text-sm text-center text-muted-foreground font-medium">
              Already have an account?{" "}
              <Link href="/login" className="text-primary hover:underline font-bold transition-all">
                Login here
              </Link>
            </p>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
