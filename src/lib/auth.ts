import { auth, clerkClient } from '@clerk/nextjs/server';

type AuthMeta = {
  userId: string;
  approved: boolean;
  role: string | undefined;
};

/**
 * Returns the current user's auth metadata.
 * Uses fresh Clerk data so stale JWT claims don't block access.
 * Throws if not signed in.
 */
export async function getAuthMeta(): Promise<AuthMeta> {
  const { userId, sessionClaims } = await auth();

  if (!userId) throw new Error('Unauthenticated');

  const jwtMeta = (sessionClaims?.metadata as Record<string, unknown>) ?? {};
  let approved = jwtMeta.approved === true;
  let role = jwtMeta.role as string | undefined;

  // If JWT metadata is missing approved/role, fetch fresh from Clerk
  if (!approved || !role) {
    try {
      const clerk = await clerkClient();
      const freshUser = await clerk.users.getUser(userId);
      const freshMeta = freshUser.publicMetadata as Record<string, unknown>;
      if (!approved) approved = freshMeta.approved === true;
      if (!role) role = freshMeta.role as string | undefined;
    } catch {
      // Fall back to JWT values
    }
  }

  return { userId, approved, role };
}

/**
 * Throws if not signed in.
 */
export async function requireAuth(): Promise<AuthMeta> {
  return getAuthMeta();
}

/**
 * Throws if not signed in or not approved.
 */
export async function requireApproved(): Promise<AuthMeta> {
  const meta = await getAuthMeta();
  if (!meta.approved) throw new Error('Access not yet approved');
  return meta;
}

/**
 * Throws if not signed in, not approved, or not an admin.
 */
export async function requireAdmin(): Promise<AuthMeta> {
  const meta = await requireApproved();
  if (meta.role !== 'admin') throw new Error('Insufficient permissions');
  return meta;
}