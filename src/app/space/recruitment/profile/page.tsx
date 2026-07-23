import { prisma } from "@/lib/prisma";
import { requireUser } from "@/lib/require-user";
import { ProfileForm } from "../profile-form";
import { saveProfile } from "../actions";

export default async function ProfilePage() {
  const session = await requireUser();

  const profile = await prisma.playerProfile.findUnique({
    where: { userId: session.user.id },
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Mon profil joueur</h1>
        <p className="text-sm text-neutral-500">
          Ces informations sont visibles par les équipes dans le Player Finder.
        </p>
      </div>
      <ProfileForm action={saveProfile} defaults={profile ?? undefined} />
    </div>
  );
}
