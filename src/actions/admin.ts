'use server';

import { auth, clerkClient } from '@clerk/nextjs/server';
import { revalidatePath } from 'next/cache';

async function assertAdmin() {
  const { sessionClaims } = await auth();
  const role = (sessionClaims?.metadata as Record<string, unknown>)?.role;
  if (role !== 'admin') throw new Error('Unauthorized');
}

export async function approveUser(userId: string) {
  await assertAdmin();
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { approved: true },
  });
  revalidatePath('/admin');
}

export async function revokeUser(userId: string) {
  await assertAdmin();
  const client = await clerkClient();
  await client.users.updateUserMetadata(userId, {
    publicMetadata: { approved: false },
  });
  revalidatePath('/admin');
}