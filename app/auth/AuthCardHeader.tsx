import { CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import Image from "next/image";

export const AuthHeader = () => {
  return (
    <CardHeader>
      <CardTitle className="flex justify-center">
        <Image
          src="/logos/imo-transparent.png"
          alt="Logo"
          width={120}
          height={120}
          className="rounded-full"
        />
      </CardTitle>
      <CardDescription className="space-y-2 text-center">
        <p className="text-sm text-gray-600">Your Real Estate Partner</p>
      </CardDescription>
    </CardHeader>
  );
};
