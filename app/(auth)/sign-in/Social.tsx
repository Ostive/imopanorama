"use client";

import { FcGoogle } from "react-icons/fc";
import { FaFacebook } from "react-icons/fa";

//Attention to the import below
import { signIn } from "next-auth/react";
import { DEFAULT_LOGIN_REDIRECT } from "@/lib/routes";
import { Button } from "@/components/ui/button";





{/* <div className="flex flex-col space-y-2">
            <Button
              onClick={() => handleSocialLogin("facebook")}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2"
              variant="outline"
            >
              <FacebookLogo />
              <span>Login with Facebook</span>
            </Button>
            <Button
              onClick={() => handleSocialLogin("google")}
              disabled={loading}
              className="w-full flex items-center justify-center space-x-2"
              variant="outline"
            >
              <GoogleLogo />
              <span>Login with Google</span>
            </Button>
          </div> */}





export const Social = () => {
  function handleSocialLogin(provider: string) {
    return signIn(provider, { callbackUrl: DEFAULT_LOGIN_REDIRECT});
  }

  return (
    <div className="flex intems-center w-full gap-x-2">
      <Button onClick={()=>handleSocialLogin("google")} className="flex items-center justify-center w-full h-12 bg-white border border-gray-300 rounded-md">
        <FcGoogle className="w-6 h-6" />
        <span className="ml-2 text-sm font-medium text-gray-800"></span>
      </Button>

      <button className="flex items-center justify-center w-full h-12 bg-white border border-gray-300 rounded-md">
        <FaFacebook className="w-6 h-6 text-blue-600" />
        <span className="ml-2 text-sm font-medium text-gray-800"></span>
      </button>
    </div>


  );
};
