/**
 * DEV ONLY. Creates a few placeholder users so the leaderboard has rows while you build.
 * Do NOT run this against production: these are not real users.
 */
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  const xps = [120, 96, 73, 61, 44, 30, 22, 15];
  for (let i = 0; i < xps.length; i++) {
    const address = '0x' + (i + 1).toString(16).padStart(40, '0');
    await prisma.user.upsert({
      where: { walletAddress: address },
      update: { xp: xps[i] },
      create: { walletAddress: address, xp: xps[i] },
    });
  }
  console.log(`Seeded ${xps.length} dev users.`);
}

main().finally(() => prisma.$disconnect());
