"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2, CheckCircle, XCircle, Mail } from "lucide-react";
import Link from "next/link";

type Status = "idle" | "loading" | "success" | "error";

// This function would be implemented in a separate file
async function requestPasswordReset(
  email: string
): Promise<{ success: boolean; message?: string; error?: string }> {
  // Implement the password reset request logic here
  // This is a mock implementation
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        success: true,
        message:
          "If an account exists for this email, a password reset link has been sent.",
      });
    }, 1500);
  });
}

export default function ResetPasswordForm() {
  const [status, setStatus] = useState<Status>("idle");
  const [message, setMessage] = useState<string>("");
  const router = useRouter();

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setStatus("loading");

    const formData = new FormData(event.currentTarget);
    const email = formData.get("email") as string;

    try {
      const data = await requestPasswordReset(email);
      if (data.success) {
        setStatus("success");
        setMessage(
          data.message ||
            "Password reset instructions have been sent to your email."
        );
      } else {
        setStatus("error");
        setMessage(
          data.error || "An error occurred while processing your request."
        );
      }
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  };

  const handleBackToSignIn = () => {
    router.push("/sign-in");
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 dark:bg-gray-900">
      <Card className="w-[350px] p-6 shadow-md">
        <CardContent className="flex flex-col items-center space-y-4 text-center">
          {status === "idle" && (
            <form onSubmit={handleSubmit} className="w-full space-y-4">
              <div className="text-center space-y-2">
                <Mail className="h-12 w-12 text-primary mx-auto" />
                <h2 className="text-2xl font-semibold">
                  Forgot Your Password?
                </h2>
                <p className="text-base text-muted-foreground mt-2">
                  No worries, we'll send you reset instructions.
                </p>
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-left block mb-2">
                  Email
                </Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  required
                  className="w-full"
                />
              </div>
              <Button type="submit" className="w-full">
                Send Reset Link
              </Button>
            </form>
          )}

          {status === "loading" && (
            <div className="space-y-4">
              <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
              <h2 className="text-2xl font-semibold text-primary">
                Processing Your Request
              </h2>
              <p className="text-base text-muted-foreground">
                This may take a moment.
              </p>
            </div>
          )}

          {status === "success" && (
            <div className="space-y-4">
              <CheckCircle className="h-12 w-12 text-green-500 mx-auto" />
              <h2 className="text-2xl font-semibold text-primary">Success!</h2>
              <p className="text-base text-muted-foreground">{message}</p>
              <Button
                onClick={handleBackToSignIn}
                className="w-full py-2 text-base mt-6"
              >
                Back to Sign In
              </Button>
            </div>
          )}

          {status === "error" && (
            <div className="space-y-4">
              <XCircle className="h-12 w-12 text-red-500 mx-auto" />
              <h2 className="text-2xl font-semibold text-primary">
                Request Failed
              </h2>
              <p className="text-base text-muted-foreground">{message}</p>
              <Button
                onClick={() => setStatus("idle")}
                className="w-full py-2 text-base mt-6"
              >
                Try Again
              </Button>
            </div>
          )}

          <div className="text-sm text-muted-foreground">
            Remember your password?{" "}
            <Link href="/sign-in" className="text-primary hover:underline">
              Sign In
            </Link>
          </div>

          <div className="text-sm text-muted-foreground">
            Need help?{" "}
            <Link
              href="/contact-support"
              className="text-primary hover:underline"
            >
              Contact Support
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
