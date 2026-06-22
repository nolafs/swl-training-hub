import { clerkClient, auth } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { approveUser, revokeUser } from '@/actions/admin';

export default async function AdminPage() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as Record<string, unknown>)?.role;
  if (role !== 'admin') redirect('/');

  const client = await clerkClient();
  const { data: users } = await client.users.getUserList({ limit: 100, orderBy: '-created_at' });

  return (
    <main className="min-h-screen bg-background px-4 py-24">
      <div className="mx-auto max-w-4xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Management</h1>
          <p className="text-sm text-muted-foreground mt-1">
            Approve or revoke access for registered users.
          </p>
        </div>

        <div className="rounded-lg border border-border overflow-hidden">
          <table className="w-full text-sm">
            <thead className="bg-muted text-muted-foreground">
              <tr>
                <th className="px-4 py-3 text-left font-medium">User</th>
                <th className="px-4 py-3 text-left font-medium">Registered</th>
                <th className="px-4 py-3 text-left font-medium">Status</th>
                <th className="px-4 py-3 text-right font-medium">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {users.map((user) => {
                const meta = user.publicMetadata as Record<string, unknown>;
                const approved = meta?.approved as boolean | undefined;
                const isAdmin = meta?.role === 'admin';
                const email = user.emailAddresses[0]?.emailAddress ?? '—';
                const name =
                  [user.firstName, user.lastName].filter(Boolean).join(' ') || email;
                const registered = new Date(user.createdAt).toLocaleDateString();

                return (
                  <tr key={user.id} className="bg-card hover:bg-muted/50 transition-colors">
                    <td className="px-4 py-3">
                      <div className="font-medium text-foreground">{name}</div>
                      <div className="text-muted-foreground text-xs">{email}</div>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">{registered}</td>
                    <td className="px-4 py-3">
                      {isAdmin ? (
                        <span className="inline-flex items-center rounded-full bg-primary/10 px-2.5 py-0.5 text-xs font-medium text-primary">
                          Admin
                        </span>
                      ) : approved ? (
                        <span className="inline-flex items-center rounded-full bg-green-100 px-2.5 py-0.5 text-xs font-medium text-green-700">
                          Approved
                        </span>
                      ) : (
                        <span className="inline-flex items-center rounded-full bg-yellow-100 px-2.5 py-0.5 text-xs font-medium text-yellow-700">
                          Pending
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3 text-right">
                      {!isAdmin && (
                        <form action={approved ? revokeUser.bind(null, user.id) : approveUser.bind(null, user.id)}>
                          <button
                            type="submit"
                            className={`text-xs font-medium underline underline-offset-4 transition-colors cursor-pointer ${
                              approved
                                ? 'text-destructive hover:text-destructive/80'
                                : 'text-foreground hover:text-foreground/70'
                            }`}
                          >
                            {approved ? 'Revoke' : 'Approve'}
                          </button>
                        </form>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>

          {users.length === 0 && (
            <div className="px-4 py-8 text-center text-muted-foreground text-sm">
              No users found.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}