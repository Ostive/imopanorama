import Link from "next/link";
import { AlertCircle, ArrowLeft } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

interface AuthErrorPageProps {
  errorMessage?: string;
}

export default function AuthErrorPage({
  errorMessage = "Une erreur s'est produite lors de l'authentification.",
}: AuthErrorPageProps) {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <Card className="w-[380px] shadow-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-destructive">
            <AlertCircle className="h-5 w-5" />
            Something went wrong
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">{errorMessage}</p>
        </CardContent>
        <CardFooter>
          <Button asChild className="w-full">
            <Link href="/sign-in">
              <ArrowLeft className="mr-2 h-4 w-4" /> Retour à la page de
              connexion
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
