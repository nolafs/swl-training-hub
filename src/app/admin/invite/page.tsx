import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { InvitePanel } from '@/components/features/auth/InvitePanel';

export default async function AdminInvitePage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/');
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Invite Users</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Send a Clerk invitation email or copy a direct sign-up link.
        </p>
      </div>

      <div className="max-w-lg">
        <InvitePanel />
      </div>
    </div>
  );
}