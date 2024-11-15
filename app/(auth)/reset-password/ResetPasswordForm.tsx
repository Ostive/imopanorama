"use client";

import { useState, useTransition } from "react";
import { set, z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";

import { Loader2 } from "lucide-react";


import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { AuthHeader } from "../AuthCardHeader";


export default function ResetPasswordForm() {
  const searchParams = useSearchParams();
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | undefined>("");

  
 
  return (
    <Card className="w-[400px] border-0 shadow-none pb-20">
      <AuthHeader />

      <CardContent>
        

        <div className="pt-4">
          <div className="relative ">
            <div className="absolute inset-0 flex items-center">
              <span className="w-full border-t" />
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-background px-2 text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter>

      </CardFooter>

      <div className="text-center">
        <span className="text-sm text-muted-foreground">
          Don't have an account?{" "}
        </span>
        <Link href="/sign-up" className="text-sm text-blue-500 hover:underline">
          Sign up
        </Link>
      </div>
    </Card>
  );
}

export { ResetPasswordForm };
