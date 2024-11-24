"use client";

import { useCallback, useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { verifyEmailWithToken } from "./verify-email.action";
import { Loader2, CheckCircle, XCircle } from "lucide-react";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";

import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";

type Status = "loading" | "success" | "error";

export default function VerifyEmailForm() {
  const [status, setStatus] = useState<Status>("loading");
  const [message, setMessage] = useState<string>("");
  const searchParams = useSearchParams();
  const router = useRouter();
  const token = searchParams.get("token");

  const onSubmit = useCallback(async () => {
    setStatus("loading");
    if (!token) {
      setStatus("error");
      setMessage("Verification failed: Token is missing");
      return;
    }

    try {
      const result = await verifyEmailWithToken(token);
      if (result.success) {
        setStatus("success");
        setMessage(result.success);

        // Rediriger vers le tableau de bord après une courte pause
        setTimeout(() => {
          router.push(DEFAULT_LOGIN_REDIRECT);
        }, 2000);
      } else {
        setStatus("error");
        setMessage(result.error || "An error occurred during verification.");
      }
    } catch (err) {
      setStatus("error");
      setMessage(
        err instanceof Error ? err.message : "An unknown error occurred"
      );
    }
  }, [token, router]);

  useEffect(() => {
    onSubmit();
  }, [onSubmit]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <Card className="w-[350px] p-6">
        <CardContent className="flex flex-col items-center space-y-6 text-center">
          {status === "loading" && (
            <>
              <Loader2 className="h-12 w-12 animate-spin text-primary" />
              <h2 className="text-2xl font-semibold">
                Verifying your email...
              </h2>
              <p className="text-muted-foreground">This may take a moment.</p>
            </>
          )}

          {status === "success" && (
            <>
              <CheckCircle className="h-12 w-12 text-green-500" />
              <h2 className="text-2xl font-semibold">Email Verified!</h2>
              <p className="text-muted-foreground">{message}</p>
            </>
          )}

          {status === "error" && (
            <>
              <XCircle className="h-12 w-12 text-red-500" />
              <h2 className="text-2xl font-semibold">Verification Failed</h2>
              <p className="text-muted-foreground">{message}</p>
              <Link href="/sign-in" className="text-primary hover:underline">
                Return to Sign In
              </Link>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
