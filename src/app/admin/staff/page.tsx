import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { requireAdmin } from "@/lib/require-admin";
import { STAFF_ROLE_LABELS } from "@/lib/labels";

export default async function StaffPage() {
  await requireAdmin();

  const staffMembers = await prisma.staff.findMany({
    orderBy: [{ lastName: "asc" }, { firstName: "asc" }],
    include: { team: true },
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">Staff</h1>
          <p className="text-sm text-neutral-500">
            Coachs, managers et analystes de votre structure.
          </p>
        </div>
        <Link
          href="/admin/staff/new"
          className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
        >
          + Ajouter un membre
        </Link>
      </div>

      <table className="w-full text-sm">
        <thead>
          <tr className="border-b border-neutral-200 text-left text-neutral-500 dark:border-neutral-800">
            <th className="py-2">Nom</th>
            <th className="py-2">Rôle</th>
            <th className="py-2">Équipe</th>
          </tr>
        </thead>
        <tbody>
          {staffMembers.map((staff) => (
            <tr
              key={staff.id}
              className="border-b border-neutral-100 hover:bg-neutral-50 dark:border-neutral-900 dark:hover:bg-neutral-900"
            >
              <td className="py-2">
                <Link
                  href={`/admin/staff/${staff.id}`}
                  className="font-medium hover:underline"
                >
                  {staff.firstName} {staff.lastName}
                </Link>
              </td>
              <td className="py-2">{STAFF_ROLE_LABELS[staff.role]}</td>
              <td className="py-2">{staff.team?.name ?? "—"}</td>
            </tr>
          ))}
          {staffMembers.length === 0 && (
            <tr>
              <td colSpan={3} className="py-6 text-center text-neutral-500">
                Aucun membre du staff pour le moment.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
