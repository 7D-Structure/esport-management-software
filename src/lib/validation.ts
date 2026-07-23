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
