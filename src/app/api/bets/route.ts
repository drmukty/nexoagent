import { Prisma } from '@prisma/client';
import { z } from 'zod';
import { prisma } from '@/lib/db';
import { WINDOW_MS } from '@/lib/betting';
import { api, fail, ok } from '@/lib/http';

const Body = z.object({ analysisId: z.string().uuid(), choice: z.enum(['AGREE', 'DISAGREE']) });
const MAX_ANALYSIS_AGE_MS = 10 * 60_000;

export const POST = api({ auth: true, limit: 20 }, async ({ req, user }) => {
  const { analysisId, choice } = Body.parse(await req.json());
  // Prices come from our stored analysis, never from the client.
  const a = await prisma.analysis.findFirst({ where: { id: analysisId, userId: user.id } });
  if (!a) return fail(404, 'Analysis not found.');
  if (Date.now() - a.createdAt.getTime() > MAX_ANALYSIS_AGE_MS) return fail(410, 'This analysis is too old to bet on. Run /analyse again.');
  try {
    const bet = await prisma.bet.create({
      data: {
        userId: user.id,
        analysisId: a.id,
        tokenSymbol: a.tokenSymbol,
        tokenCa: a.tokenCa,
        network: a.network,
        poolAddress: a.poolAddress,
        aiDirection: a.direction,
        entryPrice: a.entryPrice,
        targetPrice: a.targetPrice,
        stopPrice: a.stopPrice,
        userChoice: choice,
        resolvesAt: new Date(Date.now() + WINDOW_MS),
      },
    });
    return ok({ id: bet.id, analysisId: bet.analysisId, status: bet.status, userChoice: bet.userChoice, xpAwarded: null, resolvesAt: bet.resolvesAt, createdAt: bet.createdAt, tokenSymbol: bet.tokenSymbol });
  } catch (e) {
    if (e instanceof Prisma.PrismaClientKnownRequestError && e.code === 'P2002') return fail(409, 'You already placed a bet on this analysis.');
    throw e;
  }
});
