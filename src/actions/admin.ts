'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';
import { sendApprovalEmail } from '@/actions/organisations';

export async function approveUser(userId: string) {
  await requireAdmin();
  const client = await clerkClient();
  const user = await client.users.getUser(userId);
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { approved: true },
  });
  const email = user.emailAddresses[0]?.emailAddress;
  const name =
    [user.firstName, user.lastName].filter(Boolean).join(' ') || email || 'there';
  if (email) {
    await sendApprovalEmail(name, email).catch((err) =>
      console.error('[approveUser] email failed:', err)
    );
  }
  revalidatePath('/admin');
}

export async function revokeUser(userId: string) {
  await requireAdmin();
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { approved: false },
  });
  revalidatePath('/admin');
}

export async function setUserRole(userId: string, role: string) {
  const { userId: adminId } = await requireAdmin();
  if (userId === adminId) throw new Error('Cannot change your own role');
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { role: role || null },
  });
  revalidatePath('/admin');
}