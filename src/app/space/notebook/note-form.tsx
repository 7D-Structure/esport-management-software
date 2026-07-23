type NoteDefaults = {
  title?: string;
  content?: string;
};

export function NoteForm({
  action,
  defaults,
  submitLabel,
}: {
  action: (formData: FormData) => void;
  defaults?: NoteDefaults;
  submitLabel: string;
}) {
  return (
    <form action={action} className="max-w-3xl space-y-6">
      <div className="flex flex-col gap-1">
        <label htmlFor="title" className="text-sm font-medium">
          Titre
        </label>
        <input
          id="title"
          name="title"
          required
          placeholder="ex: Notes review demo Mirage"
          defaultValue={defaults?.title}
          className="rounded-md border border-neutral-300 px-3 py-2 text-sm dark:border-neutral-700 dark:bg-neutral-900"
        />
      </div>

      <div className="flex flex-col gap-1">
        <label htmlFor="content" className="text-sm font-medium">
          Contenu
        </label>
        <textarea
          id="content"
          name="content"
          rows={16}
          placeholder="Vos notes..."
          defaultValue={defaults?.content}
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
