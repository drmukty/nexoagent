'use client';
import { useState } from 'react';
import { Modal } from './Modal';
import { parseKey, signIn } from '@/lib/client/wallet';
import { useApp } from '@/store/app';

export function ImportWalletModal({ onClose }: { onClose: () => void }) {
  const [key, setKey] = useState('');
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');
  const refresh = useApp((s) => s.refresh);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setError('');
    let signer;
    try { 
      signer = parseKey(key); 
    } catch (err) { 
      setError(err instanceof Error ? err.message : 'Invalid key.'); 
      return; 
    }
    
    setBusy(true);
    try {
      await signIn(signer);
      setKey(''); // clear the key from the input immediately
      await refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Could not sign in.');
      setBusy(false);
    }
  }

  return (
    <Modal title="Import wallet" onClose={onClose} dismissable={!busy}>
      <form onSubmit={submit}>
        <label htmlFor="pk" className="label">EVM private key</label>
        <input 
          id="pk" 
          type="password" 
          value={key} 
          onChange={(e) => setKey(e.target.value)} 
          autoComplete="off" 
          spellCheck={false} 
          autoCapitalize="off" 
          placeholder="0x..." 
          className="mt-1 min-h-[44px] w-full rounded-lg border border-white/10 bg-black/40 px-3 font-mono text-sm outline-none focus:border-nexo-blue" 
        />
        
        {error && <p className="mt-2 text-sm text-nexo-red" role="alert">{error}</p>}
        
        <button className="btn-primary mt-4 w-full" disabled={busy || !key.trim()}>
          {busy ? 'Signing in' : 'Import wallet'}
        </button>
      </form>
    </Modal>
  );
}
