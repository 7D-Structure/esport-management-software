import "dotenv/config";
import bcrypt from "bcryptjs";
import { prisma } from "../src/lib/prisma";

async function main() {
  const email = process.env.SEED_ADMIN_EMAIL ?? "admin@example.com";
  const password = process.env.SEED_ADMIN_PASSWORD ?? "changeme123";

  const passwordHash = await bcrypt.hash(password, 10);

  const admin = await prisma.user.upsert({
    where: { email },
    update: {},
    create: {
      email,
      name: "Administrateur",
      role: "ADMIN",
      passwordHash,
    },
  });

  console.log(`Admin user ready: ${admin.email}`);

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
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
