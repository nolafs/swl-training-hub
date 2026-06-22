'use client';

import { useState, useTransition } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { sendAccessCodeEmail, createAccessCode, type AccessCode } from '@/actions/organisations';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';

const schema = z.object({
  name: z.string().min(1, 'Organisation name is required'),
  email: z.string().email('Enter a valid email address'),
  code: z
    .string()
    .regex(/^\d{4}$/, 'Code must be exactly 4 digits'),
});

type FormValues = z.infer<typeof schema>;

interface OrganisationsTableProps {
  codes: AccessCode[];
}

export function OrganisationsTable({ codes: initial }: OrganisationsTableProps) {
  const [codes, setCodes] = useState(initial);
  const [sendingId, setSendingId] = useState<string | null>(null);
  const [sentId, setSentId] = useState<string | null>(null);
  const [sendError, setSendError] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [addError, setAddError] = useState<string | null>(null);
  const [isAdding, startAdding] = useTransition();

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<FormValues>({ resolver: zodResolver(schema) });

  async function handleSend(code: AccessCode) {
    if (!code.email || !code.code || !code.name) {
      setSendError(`Missing data for ${code.name ?? 'this record'} — ensure name, code and email are set in Prismic.`);
      return;
    }
    setSendingId(code.id);
    setSentId(null);
    setSendError(null);
    try {
      await sendAccessCodeEmail(code.name, code.code, code.email);
      setSentId(code.id);
    } catch {
      setSendError(`Failed to send email to ${code.email}.`);
    } finally {
      setSendingId(null);
    }
  }

  function handleAdd(values: FormValues) {
    setAddError(null);
    const codeNum = parseInt(values.code, 10);
    startAdding(async () => {
      try {
        await createAccessCode(values.name, codeNum, values.email);
        setCodes((prev) => [
          ...prev,
          { id: Date.now().toString(), uid: '', name: values.name, code: codeNum, email: values.email },
        ]);
        reset();
        setSheetOpen(false);
      } catch (err) {
        const msg = err instanceof Error ? err.message : String(err);
        setAddError(`Failed to create access code: ${msg}`);
      }
    });
  }

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between">
        <p className="text-muted-foreground text-sm">
          {codes.length} organisation{codes.length !== 1 ? 's' : ''}
        </p>
        <button
          onClick={() => {
            setAddError(null);
            setSheetOpen(true);
          }}
          className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors"
        >
          + Add access code
        </button>
      </div>

      {/* Table */}
      <div className="border-border overflow-hidden rounded-lg border">
        <table className="w-full text-sm">
          <thead className="bg-muted text-muted-foreground">
            <tr>
              <th className="px-4 py-3 text-left font-medium">Organisation</th>
              <th className="px-4 py-3 text-left font-medium">Email</th>
              <th className="px-4 py-3 text-center font-medium">Code</th>
              <th className="px-4 py-3 text-right font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="divide-border divide-y">
            {codes.map((code) => (
              <tr key={code.id} className="bg-card hover:bg-muted/50 transition-colors">
                <td className="text-foreground px-4 py-3 font-medium">{code.name ?? '—'}</td>
                <td className="text-muted-foreground px-4 py-3">
                  {code.email ?? <span className="text-destructive text-xs">No email set</span>}
                </td>
                <td className="px-4 py-3 text-center font-mono font-semibold tracking-widest">
                  {code.code ?? '—'}
                </td>
                <td className="px-4 py-3 text-right">
                  {sentId === code.id ? (
                    <span className="text-xs font-medium text-green-600">Sent ✓</span>
                  ) : (
                    <button
                      onClick={() => handleSend(code)}
                      disabled={sendingId === code.id}
                      className="hover:text-foreground/70 cursor-pointer text-xs font-medium underline underline-offset-4 transition-colors disabled:opacity-50"
                    >
                      {sendingId === code.id ? 'Sending…' : 'Send invite'}
                    </button>
                  )}
                </td>
              </tr>
            ))}
            {codes.length === 0 && (
              <tr>
                <td colSpan={4} className="text-muted-foreground px-4 py-8 text-center">
                  No access codes found. Add one using the button above.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {sendError && <p className="text-destructive text-sm">{sendError}</p>}

      {/* Add sheet */}
      <Sheet
        open={sheetOpen}
        onOpenChange={(open) => {
          setSheetOpen(open);
          if (!open) {
            reset();
            setAddError(null);
          }
        }}
      >
        <SheetContent>
          <SheetHeader>
            <SheetTitle>New Access Code</SheetTitle>
            <SheetDescription>
              Add a new organisation and generate an access code for them.
            </SheetDescription>
          </SheetHeader>

          <form onSubmit={handleSubmit(handleAdd)} className="mt-6 space-y-5 px-4">
            <div className="space-y-1">
              <label className="text-muted-foreground block text-xs">Organisation name</label>
              <Input
                placeholder="Acme Clinic"
                className={'w-full'}
                aria-invalid={!!errors.name}
                {...register('name')}
              />
              {errors.name && <p className="text-destructive text-xs">{errors.name.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-muted-foreground block text-xs">Contact email</label>
              <Input
                type="email"
                className={'w-full'}
                placeholder="contact@clinic.com"
                aria-invalid={!!errors.email}
                {...register('email')}
              />
              {errors.email && <p className="text-destructive text-xs">{errors.email.message}</p>}
            </div>

            <div className="space-y-1">
              <label className="text-muted-foreground block text-xs">4-digit code</label>
              <Input
                inputMode="numeric"
                maxLength={4}
                placeholder="0000"
                aria-invalid={!!errors.code}
                className="w-32 text-center font-mono tracking-widest"
                {...register('code')}
              />
              {errors.code && <p className="text-destructive text-xs">{errors.code.message}</p>}
            </div>

            {addError && <p className="text-destructive text-xs">{addError}</p>}

            <div className="flex gap-3 pt-2">
              <button
                type="submit"
                disabled={isAdding}
                className="bg-primary text-primary-foreground hover:bg-primary/90 px-4 py-2 text-sm font-medium transition-colors disabled:opacity-50"
              >
                {isAdding ? 'Creating…' : 'Create'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setSheetOpen(false);
                  reset();
                }}
                className="text-muted-foreground hover:text-foreground px-4 py-2 text-sm transition-colors"
              >
                Cancel
              </button>
            </div>
          </form>
        </SheetContent>
      </Sheet>
    </div>
  );
}