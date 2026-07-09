'use client';

import { useState } from 'react';
import { SignUp } from '@clerk/nextjs';
import { validateAccessCode } from '@/actions/access-code';

export function CodeGate() {
  const [validated, setValidated] = useState(false);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError('');

    const result = await validateAccessCode(code);

    if (result.success) {
      setValidated(true);
    } else {
      setError(result.error ?? 'Invalid code.');
    }
    setLoading(false);
  }

  if (validated) {
    return <SignUp />;
  }

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-sm space-y-5">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold text-foreground">Enter Access Code</h2>
        <p className="text-sm text-muted-foreground">
          Enter the 4-digit code from your invitation email.
        </p>
      </div>

      <input
        type="text"
        inputMode="numeric"
        maxLength={4}
        value={code}
        onChange={(e) => setCode(e.target.value.replace(/\D/g, ''))}
        placeholder="0000"
        className="w-full border border-input bg-background px-4 py-3 text-center text-2xl tracking-[0.5em] focus:outline-none focus:ring-2 focus:ring-ring"
        required
      />

      {error && <p className="text-sm text-destructive">{error}</p>}

      <button
        type="submit"
        disabled={loading || code.length !== 4}
        className="w-full bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
      >
        {loading ? 'Checking…' : 'Continue'}
      </button>
    </form>
  );
}