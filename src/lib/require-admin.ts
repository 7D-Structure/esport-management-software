import { redirect } from "next/navigation";
import { auth } from "@/auth";

const ADMIN_ROLES = new Set(["ADMIN", "STAFF", "COACH"]);

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user || !ADMIN_ROLES.has(session.user.role)) {
    redirect("/login");
  }

  return session;
}
