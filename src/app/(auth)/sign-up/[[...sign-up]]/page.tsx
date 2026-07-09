import { SignUp } from '@clerk/nextjs';
import { createClient } from '@/prismicio';
import { PrismicNextImage } from '@prismicio/next';
import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';
import { CodeGate } from '@/components/features/auth/CodeGate';
import { verifyInviteToken } from '@/lib/invite-token';
import { cookies } from 'next/headers';

type Props = {
  searchParams: Promise<Record<string, string | undefined>>;
};

export default async function SignUpPage({ searchParams }: Props) {
  const params = await searchParams;
  const client = createClient();
  const settings = await client.getSingle('settings');

  // Clerk invitation link — ticket is handled automatically by <SignUp />
  const hasClerkTicket = !!params.__clerk_ticket;

  // Direct invite token — verify and set approval cookie
  const inviteToken = params.invite_token;
  let tokenValid = false;
  if (inviteToken) {
    tokenValid = verifyInviteToken(inviteToken);
    if (tokenValid) {
      const cookieStore = await cookies();
      cookieStore.set('swl_code_valid', '1', {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 60 * 60,
        path: '/',
        sameSite: 'lax',
      });
    }
  }

  const skipGate = hasClerkTicket || tokenValid;

  return (
    <main className={'flex h-svh min-h-svh w-full flex-col justify-center md:flex-row'}>
      <div className={'bg-primary hidden flex-col items-center justify-center md:flex md:w-1/2'}>
        <SliceZone slices={settings.data.slices3} components={components} />
      </div>
      <div className={'flex w-full flex-col items-center justify-center bg-white md:w-1/2'}>
        <div className="mb-6">
          <PrismicNextImage field={settings.data.logo} className={'w-48'} />
        </div>
        {skipGate ? <SignUp /> : <CodeGate />}
      </div>
    </main>
  );
}