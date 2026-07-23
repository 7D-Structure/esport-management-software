import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: { isSiteAdmin: true },
    create: {
      email,
      name: "Administrateur",
      role: "ADMIN",
      isSiteAdmin: true,
      passwordHash,
    },
  });

  console.log(`Admin user ready: ${admin.email}`);

  // Default organization (also created by the migration; ensure it exists).
  const organization = await prisma.organization.upsert({
    where: { slug: "mon-association" },
    update: {},
    create: { name: "Mon association", slug: "mon-association" },
  });

  async function addMembership(userId: string, role: "OWNER" | "MANAGER" | "COACH") {
    await prisma.organizationMembership.upsert({
      where: {
        organizationId_userId: { organizationId: organization.id, userId },
      },
      update: { role },
      create: { organizationId: organization.id, userId, role },
    });
  }

  await addMembership(admin.id, "OWNER");

  const playerEmail = process.env.SEED_PLAYER_EMAIL ?? "joueur@example.com";
  const playerPassword = process.env.SEED_PLAYER_PASSWORD ?? "changeme123";
  const playerHash = await bcrypt.hash(playerPassword, 10);

  const player = await prisma.user.upsert({
    where: { email: playerEmail },
    update: {},
    create: {
      email: playerEmail,
      name: "Joueur Démo",
      role: "PLAYER",
      passwordHash: playerHash,
    },
  });

  console.log(`Player user ready: ${player.email}`);

  const player2Email = process.env.SEED_PLAYER2_EMAIL ?? "joueur2@example.com";
  const player2Hash = await bcrypt.hash(playerPassword, 10);

  const player2 = await prisma.user.upsert({
    where: { email: player2Email },
    update: {},
    create: {
      email: player2Email,
      name: "Coach Démo",
      role: "COACH",
      passwordHash: player2Hash,
    },
  });

  console.log(`Second user ready: ${player2.email}`);

  const managerEmail = process.env.SEED_MANAGER_EMAIL ?? "manager@example.com";
  const managerHash = await bcrypt.hash(playerPassword, 10);

  const manager = await prisma.user.upsert({
    where: { email: managerEmail },
    update: {},
    create: {
      email: managerEmail,
      name: "Manager Démo",
      role: "MANAGER",
      passwordHash: managerHash,
    },
  });

  console.log(`Manager user ready: ${manager.email}`);

  await addMembership(manager.id, "MANAGER");
  await addMembership(player2.id, "COACH");
  console.log(`Default organization ready: ${organization.slug}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
