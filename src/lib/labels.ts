export const GAME_LABELS: Record<string, string> = {
  CS2: "Counter-Strike 2",
  RAINBOW_SIX_SIEGE: "Rainbow Six Siege",
  OVERWATCH_2: "Overwatch 2",
  VALORANT: "Valorant",
  OTHER: "Autre",
};

export const LICENSE_STATUS_LABELS: Record<string, string> = {
  ACTIVE: "Active",
  PENDING: "En attente",
  EXPIRED: "Expirée",
  NONE: "Aucune",
};

export const STAFF_ROLE_LABELS: Record<string, string> = {
  MANAGER: "Manager",
  HEAD_COACH: "Head coach",
  COACH: "Coach",
  ANALYST: "Analyste",
  ADMIN: "Administrateur",
  OTHER: "Autre",
};

export const CONTACT_TYPE_LABELS: Record<string, string> = {
  EMAIL: "Email",
  PHONE: "Téléphone",
  DISCORD: "Discord",
  EMERGENCY: "Contact d'urgence",
  OTHER: "Autre",
};

export const DAY_LABELS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

export const EVENT_TYPE_LABELS: Record<string, string> = {
  SCRIM: "Scrim",
  TRAINING: "Entraînement",
  MATCH: "Match",
  MEETING: "Réunion",
  OTHER: "Autre",
};

export const EVENT_STATUS_LABELS: Record<string, string> = {
  SCHEDULED: "Planifié",
  CONFIRMED: "Confirmé",
  CANCELLED: "Annulé",
  COMPLETED: "Terminé",
};

// Tailwind classes for the colored dot/badge of each event type.
export const EVENT_TYPE_COLORS: Record<string, string> = {
  SCRIM: "bg-blue-500",
  TRAINING: "bg-emerald-500",
  MATCH: "bg-red-500",
  MEETING: "bg-amber-500",
  OTHER: "bg-neutral-500",
};

export const SERVER_STATUS_LABELS: Record<string, string> = {
  ONLINE: "En ligne",
  OFFLINE: "Hors ligne",
  MAINTENANCE: "Maintenance",
  UNKNOWN: "Inconnu",
};

// Tailwind classes for the status dot of each server status.
export const SERVER_STATUS_COLORS: Record<string, string> = {
  ONLINE: "bg-emerald-500",
  OFFLINE: "bg-red-500",
  MAINTENANCE: "bg-amber-500",
  UNKNOWN: "bg-neutral-400",
};

export const GOAL_STATUS_LABELS: Record<string, string> = {
  TODO: "À faire",
  IN_PROGRESS: "En cours",
  DONE: "Atteint",
};

export const INVITATION_STATUS_LABELS: Record<string, string> = {
  PENDING: "En attente",
  ACCEPTED: "Acceptée",
  DECLINED: "Refusée",
};

export const INVITATION_STATUS_COLORS: Record<string, string> = {
  PENDING: "bg-amber-500",
  ACCEPTED: "bg-emerald-500",
  DECLINED: "bg-red-500",
};

export const DOCUMENT_CATEGORY_LABELS: Record<string, string> = {
  STATUTES: "Statuts",
  MINUTES: "Procès-verbal",
  RULES: "Règlement intérieur",
  REPORT: "Rapport",
  LICENSE: "Licence",
  INSURANCE: "Assurance",
  FINANCIAL: "Document financier",
  OTHER: "Autre",
};

export const GOAL_STATUS_COLORS: Record<string, string> = {
  TODO: "bg-neutral-400",
  IN_PROGRESS: "bg-amber-500",
  DONE: "bg-emerald-500",
};

export const FINANCE_TYPE_LABELS: Record<string, string> = {
  EXPENSE: "Dépense",
  INCOME: "Recette",
};

export const FINANCE_CATEGORY_LABELS: Record<string, string> = {
  EQUIPMENT: "Matériel",
  TRAVEL: "Déplacement",
  TOURNAMENT_FEES: "Frais de tournoi",
  SALARY: "Salaire / indemnité",
  SUBSCRIPTION: "Abonnement",
  FACILITY: "Local / serveur",
  SPONSORSHIP: "Sponsoring",
  MEMBERSHIP: "Cotisation / licence",
  DONATION: "Don",
  GRANT: "Subvention",
  OTHER: "Autre",
};
