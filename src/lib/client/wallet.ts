import { Wallet } from 'ethers';
import { api } from './api';

/** The key exists only in browser memory. It is never sent anywhere, stored, or logged. */
export type Signer = { address: string; signMessage(message: string): Promise<string> };

export function createWallet(): { signer: Signer; privateKey: string } {
  const w = Wallet.createRandom();
  return { signer: w, privateKey: w.privateKey };
}

export function parseKey(raw: string): Signer {
  let key = raw.trim();
  if (/^[0-9a-fA-F]{64}$/.test(key)) key = '0x' + key;
  if (!/^0x[0-9a-fA-F]{64}$/.test(key)) throw new Error('That is not a valid EVM private key (64 hex characters).');
  try {
    return new Wallet(key);
  } catch {
    throw new Error('That private key is not valid.');
  }
}

/** Challenge -> sign locally -> server verifies the signature and sets an httpOnly session cookie. */
export async function signIn(signer: Signer): Promise<void> {
  const { challengeId, message } = await api<{ challengeId: string; message: string }>('/api/auth/challenge', { method: 'POST', body: {} });
  const signature = await signer.signMessage(message);
  await api('/api/auth/verify', { method: 'POST', body: { address: signer.address, signature, challengeId } });
}
