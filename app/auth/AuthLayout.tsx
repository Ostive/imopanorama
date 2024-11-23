import Image from "next/image";

export function AuthLayout() {
  return (
    <div className="flex flex-col md:flex-row h-screen  ">
      <div className="flex justify-center items-center w-full md:w-1/2  p-4 sm:p-8">

      </div>
      <div className="hidden md:block w-1/2">
        <div className="relative w-full h-full">
          <Image
            src="/images/login-image.png"
            alt="Login Image"
            className="object-cover"
            layout="fill"
          />
        </div>
      </div>
    </div>
  );
}
