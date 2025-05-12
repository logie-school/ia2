"use client";

import { useState } from "react";
import { toast } from "sonner";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus, Check, X } from "lucide-react";
import { useRouter } from "next/navigation"; // Updated import

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const [email, setEmail] = useState("");
  const [confirmEmail, setConfirmEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fn, setFn] = useState(""); // First name
  const [mn, setMn] = useState(""); // Middle name (optional)
  const [sn, setSn] = useState(""); // Surname
  const [loading, setLoading] = useState(false);

  const router = useRouter(); // Use the useRouter hook

  const passwordRequirements = {
    minLength: password.length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasSpecialChar: /[!@#$%^&*(),.?":{}|<>]/.test(password),
    hasNumber: /\d/.test(password),
  };

  const isPasswordValid = Object.values(passwordRequirements).every(Boolean);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (email !== confirmEmail) {
      toast.error("Emails do not match.");
      return;
    }

    if (!isPasswordValid) {
      toast.error("Password does not meet the requirements.");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password, fn, mn, sn }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Registration successful!");
        setEmail("");
        setConfirmEmail("");
        setPassword("");
        setFn("");
        setMn("");
        setSn("");
        router.push("/login");
      } else {
        toast.error(result.message || "Something went wrong.");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <form onSubmit={handleSubmit}>
        <div className="flex flex-col gap-6">
          <div className="flex flex-row items-center justify-center gap-4">
            <UserPlus size={32} />
            <div className="flex flex-col items-start gap-2 text-center">
              <h1 className="text-2xl font-bold">Create an account</h1>
              <p className="text-muted-foreground text-sm text-balance">
                Enter your details below to create an account
              </p>
            </div>
          </div>

          <div className="grid gap-3">
            <Label htmlFor="fn">First Name</Label>
            <Input
              id="fn"
              type="text"
              placeholder="First Name"
              value={fn}
              onChange={(e) => setFn(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="mn">Middle Name (Optional)</Label>
            <Input
              id="mn"
              type="text"
              placeholder="Middle Name"
              value={mn}
              onChange={(e) => setMn(e.target.value)}
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="sn">Surname</Label>
            <Input
              id="sn"
              type="text"
              placeholder="Surname"
              value={sn}
              onChange={(e) => setSn(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
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
          <div className="grid gap-3">
            <Label htmlFor="confirmEmail">Confirm Email</Label>
            <Input
              id="confirmEmail"
              type="email"
              placeholder="m@example.com"
              value={confirmEmail}
              onChange={(e) => setConfirmEmail(e.target.value)}
              required
            />
          </div>
          <div className="grid gap-3">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                    {key === "hasSpecialChar" && "At least 1 special character"}
                    {key === "hasNumber" && "At least 1 number"}
                  </span>
                </li>
              ))}
            </ul>
          </div>
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Registering..." : "Register"}
          </Button>
        </div>
      </form>
    </div>
  );
}
