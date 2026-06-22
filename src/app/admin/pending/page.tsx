import { clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { ApproveSwitch } from '@/components/features/auth/ApproveSwitch';

export default async function AdminPendingPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/');
  }

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ limit: 100, orderBy: '-created_at' });

  const pending = users.filter((u) => {
    const meta = u.publicMetadata as Record<string, unknown>;
    return !meta?.approved && meta?.role !== 'admin';
  });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Pending Approval</h1>
        <p className="text-sm text-muted-foreground mt-1">
          {pending.length} user{pending.length !== 1 ? 's' : ''} awaiting access.
        </p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">User</th>
              <th className="px-4 py-3 text-left font-medium">Registered</th>
              <th className="px-4 py-3 text-right font-medium">Approved</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {pending.map((user) => {
              const meta = user.publicMetadata as Record<string, unknown>;
              const approved = meta?.approved === true;
              const email = user.emailAddresses[0]?.emailAddress ?? '—';
              const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || email;
              const registered = new Date(user.createdAt).toLocaleDateString();

              return (
                <tr key={user.id} className="bg-card hover:bg-muted/50 transition-colors">
                  <td className="px-4 py-3">
                    <div className="font-medium text-foreground">{name}</div>
                    <div className="text-muted-foreground text-xs">{email}</div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{registered}</td>
                  <td className="px-4 py-3 text-right">
                    <ApproveSwitch userId={user.id} approved={approved} />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
        {pending.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">
            No users pending approval.
          </div>
        )}
      </div>
    </div>
  );
}