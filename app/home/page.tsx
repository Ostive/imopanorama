import { auth } from "@/lib/auth";
import { signOut } from "@/lib/auth";
import Link from "next/link";
import { Button } from "@/components/ui/button"; // Assurez-vous que le chemin est correct pour votre projet

export default async function Page() {
  const session = await auth();

  return (
    <div className="flex justify-center items-center h-screen">
      {session ? (
        <div>
          {JSON.stringify(session)}
          <h1>Welcome, {session.user?.name ?? "User"}</h1>
          <p>Your email is {session.user?.email ?? "unknown"}</p>
          <form
            action={async () => {
              "use server";
              await signOut();
            }}
          >
            <Button type="submit">Logout</Button>
          </form>
        </div>
      ) : (
        <div>
          <p>You are not logged in.</p>
          <p>Do you want to sign in?</p>
          <Link href="/sign-in">Sign In</Link>
        </div>
      )}
    </div>
  );
}
