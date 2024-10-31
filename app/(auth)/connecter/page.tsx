"use client";

import { signOut } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function Connecter() {
    const router = useRouter();

    const handleLogout = async () => {
        await signOut({ redirect: false });
        router.push("/login"); // Redirige vers la page de connexion
    };

    return (
        <>
            <button onClick={handleLogout}>Se déconnecter</button>
        </>
    );
}
