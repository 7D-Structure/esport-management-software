import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { createStaff } from "../actions";
import { StaffForm } from "../staff-form";

export default async function NewStaffPage() {
  const { organization } = await requireAdmin();

  const teams = await prisma.team.findMany({
    where: { organizationId: organization.id },
    orderBy: { name: "asc" },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Ajouter un membre du staff</h1>
      </div>
      <StaffForm action={createStaff} teams={teams} submitLabel="Créer" />
    </div>
  );
}
