import { z } from "zod";

export const GAME_VALUES = [
  "CS2",
  "RAINBOW_SIX_SIEGE",
  "OVERWATCH_2",
  "VALORANT",
  "OTHER",
] as const;

export const LICENSE_STATUS_VALUES = [
  "ACTIVE",
  "PENDING",
  "EXPIRED",
  "NONE",
] as const;

export const STAFF_ROLE_VALUES = [
  "MANAGER",
  "HEAD_COACH",
  "COACH",
  "ANALYST",
  "ADMIN",
  "OTHER",
] as const;

export const CONTACT_TYPE_VALUES = [
  "EMAIL",
  "PHONE",
  "DISCORD",
  "EMERGENCY",
  "OTHER",
] as const;

export const EVENT_TYPE_VALUES = [
  "SCRIM",
  "TRAINING",
  "MATCH",
  "MEETING",
  "OTHER",
] as const;

export const EVENT_STATUS_VALUES = [
  "SCHEDULED",
  "CONFIRMED",
  "CANCELLED",
  "COMPLETED",
] as const;

export const SERVER_STATUS_VALUES = [
  "ONLINE",
  "OFFLINE",
  "MAINTENANCE",
  "UNKNOWN",
] as const;

export const FINANCE_TYPE_VALUES = ["EXPENSE", "INCOME"] as const;

export const FINANCE_CATEGORY_VALUES = [
  "EQUIPMENT",
  "TRAVEL",
  "TOURNAMENT_FEES",
  "SALARY",
  "SUBSCRIPTION",
  "FACILITY",
  "SPONSORSHIP",
  "MEMBERSHIP",
  "DONATION",
  "GRANT",
  "OTHER",
] as const;

const optionalDate = z
  .string()
  .optional()
  .transform((value) => (value ? new Date(value) : undefined));

const optionalString = z
  .string()
  .optional()
  .transform((value) => (value && value.length > 0 ? value : undefined));

export const playerSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  gamertag: z.string().min(1, "Le pseudo est requis"),
  game: z.enum(GAME_VALUES),
  inGameRole: optionalString,
  dateOfBirth: optionalDate,
  licenseNumber: optionalString,
  licenseStatus: z.enum(LICENSE_STATUS_VALUES).default("NONE"),
  licenseExpiresAt: optionalDate,
  teamId: optionalString,
});

export const staffSchema = z.object({
  firstName: z.string().min(1, "Le prénom est requis"),
  lastName: z.string().min(1, "Le nom est requis"),
  role: z.enum(STAFF_ROLE_VALUES).default("OTHER"),
  teamId: optionalString,
});

export const teamSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  game: z.enum(GAME_VALUES),
});

export const contactSchema = z.object({
  type: z.enum(CONTACT_TYPE_VALUES),
  value: z.string().min(1, "La valeur est requise"),
  label: optionalString,
});

export const availabilitySchema = z.object({
  dayOfWeek: z.coerce.number().int().min(0).max(6),
  startTime: z.string().regex(/^\d{2}:\d{2}$/, "Format attendu HH:mm"),
  endTime: z.string().regex(/^\d{2}:\d{2}$/, "Format attendu HH:mm"),
  note: optionalString,
});

export const eventSchema = z
  .object({
    title: z.string().min(1, "Le titre est requis"),
    type: z.enum(EVENT_TYPE_VALUES).default("SCRIM"),
    startsAt: z.coerce.date({ message: "La date de début est requise" }),
    endsAt: optionalDate,
    opponent: optionalString,
    location: optionalString,
    notes: optionalString,
    status: z.enum(EVENT_STATUS_VALUES).default("SCHEDULED"),
    teamId: optionalString,
  })
  .refine((data) => !data.endsAt || data.endsAt >= data.startsAt, {
    message: "La fin doit être après le début",
    path: ["endsAt"],
  });

const optionalPort = z
  .string()
  .optional()
  .transform((value) => (value && value.length > 0 ? Number(value) : undefined))
  .refine(
    (value) =>
      value === undefined ||
      (Number.isInteger(value) && value >= 1 && value <= 65535),
    { message: "Port invalide (1-65535)" },
  );

export const gameServerSchema = z.object({
  name: z.string().min(1, "Le nom est requis"),
  game: z.enum(GAME_VALUES),
  status: z.enum(SERVER_STATUS_VALUES).default("UNKNOWN"),
  host: z.string().min(1, "L'hôte est requis"),
  port: optionalPort,
  serverPassword: optionalString,
  rconPassword: optionalString,
  provider: optionalString,
  location: optionalString,
  notes: optionalString,
  teamId: optionalString,
});

export const financeEntrySchema = z.object({
  label: z.string().min(1, "Le libellé est requis"),
  type: z.enum(FINANCE_TYPE_VALUES),
  category: z.enum(FINANCE_CATEGORY_VALUES).default("OTHER"),
  amount: z.coerce
    .number({ message: "Le montant est requis" })
    .positive("Le montant doit être positif"),
  date: z.coerce.date({ message: "La date est requise" }),
  notes: optionalString,
  teamId: optionalString,
});
