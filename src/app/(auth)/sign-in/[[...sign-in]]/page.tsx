import { SignIn } from '@clerk/nextjs';
import { createClient } from '@/prismicio';
import { PrismicNextImage } from '@prismicio/next';
import { SliceZone } from '@prismicio/react';
import { components } from '@/slices';

export default async function SignInPage() {

  const client = createClient();
  const settings = await client.getSingle('settings');




  return (
    <main className={'flex h-svh min-h-svh w-full flex-col justify-center md:flex-row'}>
      <div className={'flex w-full flex-col items-center justify-center bg-white md:w-1/2'}>
        <div>
          <PrismicNextImage field={settings.data.logo} className={'w-48'} />
        </div>
        <SignIn
          appearance={{
            elements: {
              footerActionLink: { display: 'none' },
              footerAction: { display: 'none' },
            },
          }}
        />
      </div>
      <div className={'bg-primary hidden flex-col items-center justify-center md:flex md:w-1/2'}>
        <SliceZone slices={settings.data.slices2} components={components} />
      </div>
    </main>
  );
}