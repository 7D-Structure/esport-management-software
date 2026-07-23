import { redirect } from "next/navigation";
import { auth } from "@/auth";

const ADMIN_ROLES = new Set(["ADMIN", "STAFF", "MANAGER", "COACH"]);

export async function requireAdmin() {
  const session = await auth();

  if (!session?.user || !ADMIN_ROLES.has(session.user.role)) {
    redirect("/login");
  }

  return session;
}

// Stricter guard for sensitive management (accounts & roles): ADMIN only.
export async function requireSuperAdmin() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }
  if (session.user.role !== "ADMIN") {
    redirect("/admin/players");
  }

  return session;
}
