import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Post-login landing that routes users to the right space based on their role.
export default async function EnterPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  const role = session.user.role;
  if (role === "ADMIN" || role === "STAFF") {
    redirect("/admin/players");
  }

  redirect("/space");
}
