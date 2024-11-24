<<<<<<< HEAD
import { handlers } from "@/lib/auth";
export const { GET, POST } = handlers;
=======
import { handlers } from "@/lib/auth"; // Referring to the auth.ts we just created
export const { GET, POST } = handlers;

export { auth as middleware } from "@/lib/auth";

>>>>>>> 3446c28164d4dfde3ffa9a54a79847da661e415f
