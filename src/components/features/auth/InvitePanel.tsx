'use client';

import { useState } from 'react';
import { sendClerkInvitation, generateInviteLink } from '@/actions/invitations';

export function InvitePanel() {
  const [email, setEmail] = useState('');
  const [emailStatus, setEmailStatus] = useState<{ success?: boolean; message?: string } | null>(null);
  const [emailLoading, setEmailLoading] = useState(false);

  const [linkStatus, setLinkStatus] = useState<string | null>(null);
  const [linkLoading, setLinkLoading] = useState(false);

  async function handleSendInvite(e: React.FormEvent) {
    e.preventDefault();
    setEmailLoading(true);
    setEmailStatus(null);

    const result = await sendClerkInvitation(email);

    if (result.success) {
      setEmailStatus({ success: true, message: `Invitation sent to ${email}` });
      setEmail('');
    } else {
      setEmailStatus({ success: false, message: result.error });
    }
    setEmailLoading(false);
  }

  async function handleCopyLink() {
    setLinkLoading(true);
    setLinkStatus(null);

    try {
      const url = await generateInviteLink();
      await navigator.clipboard.writeText(url);
      setLinkStatus('Link copied to clipboard — valid for 24 hours.');
    } catch {
      setLinkStatus('Could not generate link.');
    }
    setLinkLoading(false);
  }

  return (
    <div className="rounded-lg border border-border p-6 space-y-6">
      <h2 className="text-base font-semibold text-foreground">Invite Users</h2>

      {/* Clerk email invitation */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Via Clerk email
        </p>
        <form onSubmit={handleSendInvite} className="flex gap-2">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="email@example.com"
            required
            className="flex-1 border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <button
            type="submit"
            disabled={emailLoading}
            className="bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          >
            {emailLoading ? 'Sending…' : 'Send invite'}
          </button>
        </form>
        {emailStatus && (
          <p className={`text-xs ${emailStatus.success ? 'text-green-600' : 'text-destructive'}`}>
            {emailStatus.message}
          </p>
        )}
      </div>

      {/* Direct invite link */}
      <div className="space-y-3">
        <p className="text-xs text-muted-foreground font-medium uppercase tracking-wide">
          Direct invite link
        </p>
        <button
          onClick={handleCopyLink}
          disabled={linkLoading}
          className="border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted disabled:opacity-50 transition-colors"
        >
          {linkLoading ? 'Generating…' : 'Copy invite link'}
        </button>
        {linkStatus && <p className="text-xs text-muted-foreground">{linkStatus}</p>}
      </div>
    </div>
  );
}