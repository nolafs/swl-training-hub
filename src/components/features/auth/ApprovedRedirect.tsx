'use client';

import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export function ApprovedRedirect({ silent = false }: { silent?: boolean }) {
  const { user } = useUser();
  const router = useRouter();

  useEffect(() => {
    if (!user) return;

    const interval = setInterval(async () => {
      await user.reload();
      const meta = user.publicMetadata as Record<string, unknown>;
      if (meta?.approved) {
        clearInterval(interval);
        router.push('/');
      }
    }, 1500);

    return () => clearInterval(interval);
  }, [user, router]);

  if (silent) return null;

  return (
    <div className="text-center space-y-3">
      <h1 className="text-2xl font-bold text-foreground">Access Approved!</h1>
      <p className="text-muted-foreground text-sm">Redirecting you to the training hub…</p>
    </div>
  );
}