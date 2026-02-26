"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";

export default function OTPPage() {
  const router = useRouter();
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [countdown, setCountdown] = useState(0);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const storedUsername = localStorage.getItem("pending_username");
    if (!storedUsername) {
      router.push("/register");
    } else {
      setUsername(storedUsername);
    }

    const savedExpiry = localStorage.getItem("otp_expiry");
    if (savedExpiry) {
      const remaining = Math.max(0, Math.floor((parseInt(savedExpiry) - Date.now()) / 1000));
      setCountdown(remaining);
    }
  }, [router]);

  useEffect(() => {
    if (countdown > 0) {
      const timer = setTimeout(() => setCountdown(countdown - 1), 1000);
      return () => clearTimeout(timer);
    }
  }, [countdown]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      const response = await api.post("/auth/verify-otp", { username, otp });
      const { token, user_id } = response.data.data;
      
      localStorage.setItem("token", token);
      localStorage.setItem("user_id", user_id);
      localStorage.removeItem("pending_username");
      localStorage.removeItem("otp_expiry");

      router.push("/business-setup");
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP code.");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    try {
      await api.post("/auth/send-otp", { username });
      const expiry = Date.now() + 5 * 60 * 1000;
      localStorage.setItem("otp_expiry", expiry.toString());
      setCountdown(300);
      setError("");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to resend OTP.");
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4 font-sans">
      <Card className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-serif font-bold text-center">Verify WhatsApp</CardTitle>
          <CardDescription className="text-center font-medium">
            We've sent a 6-digit code to your WhatsApp
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-6">
            {error && (
              <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                {error}
              </div>
            )}
            <div className="flex justify-center">
              <Input
                value={otp}
                onChange={(e) => setOtp(e.target.value.replace(/\D/g, "").slice(0, 6))}
                placeholder="000000"
                className="text-center text-4xl tracking-[0.5em] font-mono h-16 w-full max-w-[240px] border-2 focus:border-primary"
                required
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col gap-4">
            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20" disabled={loading || otp.length < 6}>
              {loading ? "Verifying..." : "Verify OTP"}
            </Button>
            <div className="text-sm text-center">
              {countdown > 0 ? (
                <span className="text-muted-foreground">
                  Resend code in <span className="font-bold text-foreground">{Math.floor(countdown / 60)}:{(countdown % 60).toString().padStart(2, "0")}</span>
                </span>
              ) : (
                <button type="button" onClick={handleResend} className="text-primary hover:underline font-bold">
                  Resend OTP Code
                </button>
              )}
            </div>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
