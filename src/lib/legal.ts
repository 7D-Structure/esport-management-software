// Company & hosting information for the legal pages.
// TODO: renseigner SIREN et SIRET une fois disponibles.
export const COMPANY = {
  publisher: "Maxence Goutteratel",
  legalForm: "Entrepreneur individuel (EI)",
  tradeName: "7d Studio",
  siren: "", // à compléter
  siret: "", // à compléter
  contactEmail: "pro@mgoutter.fr",
  directorOfPublication: "Maxence Goutteratel",
};

export const HOST = {
  name: "o2switch",
  address: "222-224 Boulevard Gustave Flaubert, 63000 Clermont-Ferrand, France",
  phone: "04 44 44 60 40",
  website: "https://www.o2switch.fr",
};

export const SITE_NAME = "Esport Management Software";

// Human-readable value or a clear placeholder when not yet provided.
export function orTodo(value: string): string {
  return value.trim() || "À compléter";
}
