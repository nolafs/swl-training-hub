'use server';

import * as prismic from '@prismicio/client';
import { createClient } from '@/prismicio';
import { createWriteClient } from '@/lib/prismic-write';
import { MailerSend, EmailParams, Sender, Recipient } from 'mailersend';
import { requireAdmin } from '@/lib/auth';
import { revalidatePath } from 'next/cache';

// Extend the base type until Prismic types are regenerated with the email field
export type AccessCode = {
  id: string;
  uid: string;
  name: string | null;
  code: number | null;
  email: string | null;
};

export async function getAccessCodes(): Promise<AccessCode[]> {
  await requireAdmin();
  const client = createClient();
  const docs = await client.getAllByType('client_access_code', {
    orderings: [{ field: 'document.first_publication_date', direction: 'asc' }],
  });

  return docs.map((doc) => {
    const data = doc.data as Record<string, unknown>;
    return {
      id: doc.id,
      uid: doc.uid ?? doc.id,
      name: (data.name as string) ?? null,
      code: (data.code as number) ?? null,
      email: (data.email as string) ?? null,
    };
  });
}

export async function sendAccessCodeEmail(name: string, code: number, email: string) {
  await requireAdmin();

  const mailerSend = new MailerSend({ apiKey: process.env.MAILERSEND_API_KEY! });
  const from = new Sender(
    `noreply@${process.env.MAILERSEND_DOMAIN}`,
    'SWL Training Hub'
  );
  const recipients = [new Recipient(email, name)];

  const personalization = [
    {
      email,
      data: {
        name,
        code: String(code),
        sign_up_url: `${process.env.NEXT_PUBLIC_BASE_URL}/sign-up`,
      },
    },
  ];

  const params = new EmailParams()
    .setFrom(from)
    .setTo(recipients)
    .setSubject('Your SWL Training Hub Access Code')
    .setTemplateId(process.env.MAILERSEND_TEMPLATE_ID!)
    .setPersonalization(personalization);

  await mailerSend.email.send(params);
}

export async function createAccessCode(name: string, code: number, email: string) {
  await requireAdmin();

  const writeClient = createWriteClient();
  const migration = prismic.createMigration();

  migration.createDocument(
    {
      type: 'client_access_code',
      uid: `org-${Date.now()}`,
      lang: 'en-gb',
      data: { name, code, email },
    },
    name
  );

  await writeClient.migrate(migration, {
    reporter: (event) => console.log('[prismic-migrate]', JSON.stringify(event)),
  });
  revalidatePath('/admin/organisations');
}
