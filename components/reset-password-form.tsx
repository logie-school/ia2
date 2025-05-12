"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
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
import { Check, X } from "lucide-react";

export function ResetPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const [email, setEmail] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const passwordRequirements = {
    minLength: newPassword.length >= 8,
    hasUppercase: /[A-Z]/.test(newPassword),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(newPassword),
    hasNumber: /\d/.test(newPassword),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isPasswordValid) {
      toast.error("New password does not meet the requirements.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/reset-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, oldPassword, newPassword }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(result.message || "Password reset successful!");
        setEmail("");
        setOldPassword("");
        setNewPassword("");
      } else {
        toast.error(result.message || "An error occurred.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader className="text-center">
          <CardTitle className="text-xl">Reset Password</CardTitle>
          <CardDescription>
            Reset your password by entering your email and old password below
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit}>
            <div className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="oldPassword">Old Password</Label>
                <Input
                  id="oldPassword"
                  type="password"
                  placeholder="Enter your old password"
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="newPassword">New Password</Label>
                <Input
                  id="newPassword"
                  type="password"
                  placeholder="Enter your new password"
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                />
                <ul className="text-sm transition-all">
                  {Object.entries(passwordRequirements).map(([key, isValid]) => (
                    <li
                      key={key}
                      className="flex items-center gap-2 transition-all"
                    >
                      <div className="relative w-4 h-4">
                        <Check
                          size={16}
                          className={`absolute transition-all ${
                            isValid
                              ? "opacity-100 scale-100 text-green-500"
                              : "opacity-0 scale-75"
                          }`}
                        />
                        <X
                          size={16}
                          className={`absolute transition-all ${
                            !isValid
                              ? "opacity-100 scale-100 text-red-500"
                              : "opacity-0 scale-75"
                          }`}
                        />
                      </div>
                      <span
                        className={`transition-colors ${
                          isValid ? "text-green-500" : "text-red-500"
                        }`}
                      >
                        {key === "minLength" && "At least 8 characters"}
                        {key === "hasUppercase" && "At least 1 uppercase letter"}
                        {key === "hasSpecialChar" &&
                          "At least 1 special character"}
                        {key === "hasNumber" && "At least 1 number"}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
              <Button type="submit" className="w-full" disabled={loading}>
                {loading ? "Resetting..." : "Reset Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
