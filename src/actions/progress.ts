'use server';

import { clerkClient } from '@clerk/nextjs/server';
import { requireAuth } from '@/lib/auth';

export async function saveUserCourseProgress(progress: number) {
  const { userId } = await requireAuth();
  const clerk = await clerkClient();
  await clerk.users.updateUserMetadata(userId, {
    publicMetadata: { courseProgress: Math.round(progress) },
  });
}