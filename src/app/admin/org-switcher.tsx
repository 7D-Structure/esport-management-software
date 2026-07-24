"use client";

import { useRef } from "react";
import { switchOrganization } from "./org-actions";

type OrgOption = { id: string; name: string };

export function OrgSwitcher({
  memberships,
  activeId,
}: {
  memberships: OrgOption[];
  activeId: string;
}) {
  const formRef = useRef<HTMLFormElement>(null);

  // A single organization: just show its name, no switcher.
  if (memberships.length <= 1) {
    const only = memberships.find((m) => m.id === activeId);
    return (
      <span className="font-medium text-neutral-700 dark:text-neutral-300">
        {only?.name}
      </span>
    );
  }

  return (
    <form action={switchOrganization} ref={formRef}>
      <select
        name="orgId"
        defaultValue={activeId}
        onChange={() => formRef.current?.requestSubmit()}
        className="rounded-md border border-neutral-300 px-2 py-1 text-sm dark:border-neutral-700 dark:bg-neutral-900"
      >
        {memberships.map((m) => (
          <option key={m.id} value={m.id}>
            {m.name}
          </option>
        ))}
      </select>
    </form>
  );
}
