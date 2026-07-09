import { SignOutButton } from '@clerk/nextjs';
import { auth, clerkClient } from '@clerk/nextjs/server';
import { redirect } from 'next/navigation';
import { autoApproveIfValidCode } from '@/actions/access-code';

export default async function PendingPage() {
  const { userId } = await auth();

  if (!userId) redirect('/sign-in');

  // Use fresh Clerk data, not stale session JWT claims
  const clerk = await clerkClient();
  const freshUser = await clerk.users.getUser(userId);
  const approved = freshUser.publicMetadata?.approved === true;
  if (approved) redirect('/');

  // Check for valid access code cookie and auto-approve
  const wasApproved = await autoApproveIfValidCode();
  if (wasApproved) redirect('/');

  return (
    <main className="min-h-screen flex items-center justify-center bg-background px-4">
      <div className="w-full max-w-md text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-2xl font-bold text-foreground">Access Pending</h1>
          <p className="text-muted-foreground">
            Your account has been created and is awaiting approval. You will receive an email once
            access has been granted.
          </p>
        </div>

        <div className="rounded-lg border border-border bg-card p-6 text-sm text-muted-foreground">
          If you believe this is taking longer than expected, please contact the administrator.
        </div>

        <SignOutButton redirectUrl="/sign-in">
          <button className="text-sm text-muted-foreground underline underline-offset-4 hover:text-foreground transition-colors cursor-pointer">
            Sign out
          </button>
        </SignOutButton>
      </div>
    </main>
  );
}