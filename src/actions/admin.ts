'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';
import { requireAdmin } from '@/lib/auth';

export async function approveUser(userId: string) {
  await requireAdmin();
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { approved: true },
  });
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