'use client';
import { Check, Copy, Eye, EyeOff } from 'lucide-react';
import { useRef, useState } from 'react';
import { Modal } from './Modal';
import { createWallet, signIn, type Signer } from '@/lib/client/wallet';
import { useApp } from '@/store/app';

export function CreateWalletModal({ onClose }: { onClose: () => void }) {
  const wallet = useRef<{ signer: Signer; privateKey: string } | null>(null);
  if (!wallet.current) wallet.current = createWallet();
  const [reveal, setReveal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const refresh = useApp((s) => s.refresh);
  const { signer, privateKey } = wallet.current;

  async function copy() {
    try { 
      await navigator.clipboard.writeText(privateKey); 
      setCopied(true); 
      setTimeout(() => setCopied(false), 2000); 
    } catch { 
      setError('Copy failed. Select the key and copy it manually.'); 
    }
  }

  async function confirm() {
    setBusy(true); setError('');
    try {
      await signIn(signer);
      wallet.current = null; 
      
      // 1. Clear the logout block flag so the store allows login
      if (typeof window !== 'undefined') {
        localStorage.removeItem('nexo_logged_out');
      }
      
      // 2. Fetch the user data (now it will succeed)
      await refresh();
      
      // 3. Close the modal
      onClose();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Could not create the account.');
      setBusy(false);
    }
  }

  return (
    <Modal title="Create wallet" onClose={onClose} dismissable={!busy}>
      <p className="label mb-1 mt-2">Address</p>
      <p className="mb-3 break-all rounded-lg bg-black/40 p-3 font-mono text-xs text-gray-300">{signer.address}</p>
      
      <p className="label mb-1">Private key</p>
      <div className="relative rounded-lg border border-white/10 bg-black/40 p-3">
        <p className={`break-all pr-10 font-mono text-xs ${reveal ? 'text-white' : 'select-none text-transparent [text-shadow:0_0_9px_rgba(255,255,255,0.6)]'}`}>{privateKey}</p>
        <button className="tap absolute right-1 top-1" onClick={() => setReveal((v) => !v)} aria-label={reveal ? 'Hide key' : 'Reveal key'}>{reveal ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
      </div>
      <p className="mt-2 text-xs text-gray-400">Store this key safely. It will never be shown again.</p>
      
      {error && <p className="mt-3 text-sm text-nexo-red" role="alert">{error}</p>}
      
      <div className="mt-5 flex flex-col gap-2 sm:flex-row">
        <button className="btn-ghost flex-1" onClick={copy}>{copied ? <Check className="h-4 w-4 text-nexo-green" /> : <Copy className="h-4 w-4" />}{copied ? 'Copied' : 'Copy key'}</button>
        <button className="btn-primary flex-1" onClick={confirm} disabled={busy}>{busy ? 'Creating account' : 'Save & Confirm'}</button>
      </div>
    </Modal>
  );
}
