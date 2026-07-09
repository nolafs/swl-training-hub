import { auth } from '@clerk/nextjs/server';

type AuthMeta = {
  userId: string;
  approved: boolean;
  role: string | undefined;
};

/**
 * Returns the current user's auth metadata.
 * Throws if not signed in.
 */
export async function getAuthMeta(): Promise<AuthMeta> {
  const { userId, sessionClaims } = await auth();

  if (!userId) throw new Error('Unauthenticated');

  const metadata = (sessionClaims?.metadata as Record<string, unknown>) ?? {};

  return {
    userId,
    approved: metadata.approved === true,
    role: metadata.role as string | undefined,
  };
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