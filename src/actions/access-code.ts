
'use server';

import { createClient } from '@/prismicio';
import { clerkClient } from '@clerk/nextjs/server';
import { cookies } from 'next/headers';
import { requireAuth } from '@/lib/auth';

const COOKIE_NAME = 'swl_code_valid';

export async function validateAccessCode(code: string) {
  if (!/^\d{4}$/.test(code)) {
    return { success: false, error: 'Please enter a 4-digit code.' };
  }

  try {
    const client = createClient();
    const codes = await client.getAllByType('client_access_code');
    const match = codes.find((doc) => String(doc.data.code) === code);

    if (!match) {
      return { success: false, error: 'Invalid access code. Please check your invitation.' };
    }

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, '1', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60, // 1 hour
      path: '/',
      sameSite: 'lax',
    });

    return { success: true };
  } catch {
    return { success: false, error: 'Could not validate code. Please try again.' };
  }
}

export async function autoApproveIfValidCode() {
  const cookieStore = await cookies();
  const valid = cookieStore.get(COOKIE_NAME);
  if (!valid) return false;

  let userId: string;
  try {
    ({ userId } = await requireAuth());
  } catch {
    return false;
  }

  try {
    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(userId, {
      publicMetadata: { approved: true },
    });
    cookieStore.delete(COOKIE_NAME);
    return true;
  } catch {
    return false;
  }
}