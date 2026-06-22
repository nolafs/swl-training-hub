import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { readFile } from 'fs/promises';
import path from 'path';
import { MarkdownContent } from './MarkdownContent';

export default async function AdminHelpPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/');
  }

  const filePath = path.join(process.cwd(), 'src/assets/user-invitations.md');
  const content = await readFile(filePath, 'utf-8');

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Help</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Guide to inviting users and managing access.
        </p>
      </div>
      <div className="rounded-lg border border-border bg-card p-8 max-w-3xl">
        <MarkdownContent content={content} />
      </div>
    </div>
  );
}