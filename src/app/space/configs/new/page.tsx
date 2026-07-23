import { requireUser } from "@/lib/require-user";
import { createConfig } from "../actions";
import { ConfigForm } from "../config-form";

export default async function NewConfigPage() {
  await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Nouvelle config</h1>
      </div>
      <ConfigForm action={createConfig} submitLabel="Créer" />
    </div>
  );
}
