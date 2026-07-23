import { redirect } from "next/navigation";
import { auth } from "@/auth";

// Post-login landing that routes users to the right space based on their role.
export default async function EnterPage() {
  const session = await auth();

  if (!session?.user) {
    redirect("/login");
  }

  // Management roles land in the admin area; coaches and players in their space.
  const role = session.user.role;
  if (role === "ADMIN" || role === "STAFF" || role === "MANAGER") {
    redirect("/admin/players");
  }

  redirect("/space");
}
