import { DOCUMENT_CATEGORY_LABELS } from "@/lib/labels";
import { DOCUMENT_CATEGORY_VALUES } from "@/lib/validation";

type DocumentDefaults = {
  title?: string;
  category?: string;
  description?: string | null;
  url?: string;
};

export function DocumentForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaults?: DocumentDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-2xl space-y-6">
      <div className="grid grid-cols-2 gap-4">
        <div className="flex flex-col gap-1">
          <label htmlFor="title" className="text-sm font-medium">
            Titre
          </label>
          <input
            id="title"
            name="title"
            required
            placeholder="ex: Statuts de l'association"
            defaultValue={defaults?.title}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          />
        </div>
        <div className="flex flex-col gap-1">
          <label htmlFor="category" className="text-sm font-medium">
            Catégorie
          </label>
          <select
            id="category"
            name="category"
            defaultValue={defaults?.category ?? "OTHER"}
            className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
          >
            {DOCUMENT_CATEGORY_VALUES.map((category) => (
              <option key={category} value={category}>
                {DOCUMENT_CATEGORY_LABELS[category]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="url" className="text-sm font-medium">
          Lien du document
        </label>
        <input
          id="url"
          name="url"
          type="url"
          required
          placeholder="https://drive.google.com/..."
          defaultValue={defaults?.url}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
        <p className="text-xs text-neutral-500">
          Lien vers le document hébergé (Google Drive, Nextcloud, PDF public...).
        </p>
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="description" className="text-sm font-medium">
          Description (optionnel)
        </label>
        <textarea
          id="description"
          name="description"
          rows={3}
          defaultValue={defaults?.description ?? ""}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <button
        type="submit"
        className="rounded-md bg-neutral-900 px-4 py-2 text-sm font-medium text-white dark:bg-white dark:text-neutral-900"
      >
        {submitLabel}
      </button>
    </form>
  );
}
