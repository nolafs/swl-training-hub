'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { createInviteToken } from '@/lib/invite-token';
import { requireAdmin } from '@/lib/auth';

export async function generateInviteLink(): Promise<string> {
  await requireAdmin();
  const token = createInviteToken();
  return `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up?invite_token=${token}`;
}

export async function sendClerkInvitation(email: string) {
  await requireAdmin();

  try {
    const clerk = await clerkClient();
    await clerk.invitations.createInvitation({
      emailAddress: email,
      redirectUrl: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up`,
      publicMetadata: { approved: true },
    });
    return { success: true };
  } catch (e: unknown) {
    const message = e instanceof Error ? e.message : 'Failed to send invitation.';
    return { success: false, error: message };
  }
}
