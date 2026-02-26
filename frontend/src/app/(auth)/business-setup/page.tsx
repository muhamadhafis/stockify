"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

export default function BusinessSetupPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const userId = localStorage.getItem("user_id");
    if (!userId) {
      setError("User session not found. Please register again.");
      router.push("/register");
      return;
    }

    const formData = new FormData(e.currentTarget);
    const businessName = formData.get("name") as string;
    
    const data = {
      name: businessName,
      description: `Inventory management for ${businessName}`,
      user_id: userId
    };

    try {
      await api.post("/businesses", data);
      router.push("/dashboard");
    } catch (err: any) {
      setError(err.response?.data?.message || "Failed to create business.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-muted/30 p-4 font-sans">
      <Card className="w-full max-w-md shadow-2xl border-border">
        <CardHeader className="space-y-1">
          <CardTitle className="text-3xl font-serif font-bold text-center">Setup Business</CardTitle>
          <CardDescription className="text-center font-medium">
            One last step to get you started
          </CardDescription>
        </CardHeader>
        <form onSubmit={handleSubmit}>
          <CardContent className="space-y-4">
            {error && (
              <div className="p-3 text-sm font-medium text-destructive bg-destructive/10 border border-destructive/20 rounded-lg">
                {error}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="name" className="text-sm font-bold">Business Name</Label>
              <Input id="name" name="name" placeholder="My Awesome Store" required className="h-11" />
            </div>
          </CardContent>
          <CardFooter>
            <Button type="submit" className="w-full h-12 text-base font-semibold shadow-lg shadow-primary/20" disabled={loading}>
              {loading ? "Setting up..." : "Complete Setup"}
            </Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  );
}
