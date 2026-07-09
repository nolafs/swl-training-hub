import { redirect } from 'next/navigation';
import { requireAdmin } from '@/lib/auth';
import { getAccessCodes } from '@/actions/organisations';
import { OrganisationsTable } from '@/components/features/admin/OrganisationsTable';

export default async function AdminOrganisationsPage() {
  try {
    await requireAdmin();
  } catch {
    redirect('/');
  }

  const codes = await getAccessCodes();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-foreground">Organisations</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Manage access codes and send invitations to organisations.
        </p>
      </div>
      <OrganisationsTable codes={codes} />
    </div>
  );
}