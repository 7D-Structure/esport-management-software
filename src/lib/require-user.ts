import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Require any authenticated user (player, coach, staff or admin).
export async function requireUser() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  return session;
}
