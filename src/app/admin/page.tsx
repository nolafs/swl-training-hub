import { clerkClient } from '@clerk/nextjs/server';
import type { User } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { ApproveSwitch } from '@/components/features/auth/ApproveSwitch';
import { RoleSelect } from '@/components/features/auth/RoleSelect';

const UserRow = ({ user }: { user: User }) => {
  const meta = user.publicMetadata as Record<string, unknown>;
  const approved = meta?.approved as boolean | undefined;
  const isAdmin = meta?.role === 'admin';
  const email = user.emailAddresses[0]?.emailAddress ?? '—';
  const name = [user.firstName, user.lastName].filter(Boolean).join(' ') || email;
  const registered = new Date(user.createdAt).toLocaleDateString();
  const courseProgress = typeof meta?.courseProgress === 'number' ? meta.courseProgress : null;

  return (
    <tr key={user.id} className="bg-card hover:bg-muted/50 transition-colors">
      <td className="px-4 py-3">
        <div className="text-foreground font-medium">{name}</div>
        <div className="text-muted-foreground text-xs">{email}</div>
      </td>
      <td className="text-muted-foreground px-4 py-3">{registered}</td>
      <td className="px-4 py-3">
        {courseProgress !== null ? (
          <div className="flex items-center gap-2">
            <div className="h-1.5 w-24 rounded-full bg-muted overflow-hidden">
              <div className="h-full bg-primary rounded-full" style={{ width: `${courseProgress}%` }} />
            </div>
            <span className="text-xs text-muted-foreground tabular-nums">{courseProgress}%</span>
          </div>
        ) : (
          <span className="text-xs text-muted-foreground">—</span>
        )}
      </td>
      <td className="px-4 py-3 text-center">
        <RoleSelect userId={user.id} role={meta?.role as string | undefined} />
      </td>
      <td className="px-4 py-3 text-right">
        {!isAdmin && <ApproveSwitch userId={user.id} approved={approved === true} />}
      </td>
    </tr>
  );
}


export default async function AdminUsersPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/');
  }

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ limit: 100, orderBy: '-created_at' });

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">All Users</h1>
        <p className="text-sm text-muted-foreground mt-1">Manage access for all registered users.</p>
      </div>

      <div className="rounded-lg border border-border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">User</th>
              <th className="px-4 py-3 text-left font-medium">Registered</th>
              <th className="px-4 py-3 text-left font-medium">Progress</th>
              <th className="px-4 py-3 text-center font-medium">Role</th>
              <th className="px-4 py-3 text-right font-medium">Access</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">
            {users.map((user) => <UserRow key={user.id} user={user} />)}
          </tbody>
        </table>
        {users.length === 0 && (
          <div className="px-4 py-8 text-center text-muted-foreground text-sm">No users found.</div>
        )}
      </div>
    </div>
  );
}