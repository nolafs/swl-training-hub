'use client';

import { useTransition } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { setUserRole } from '@/actions/admin';

const ROLES = [
  { value: 'user', label: 'User' },
  { value: 'admin', label: 'Admin' },
];

interface RoleSelectProps {
  userId: string;
  role: string | undefined;
}

export function RoleSelect({ userId, role }: RoleSelectProps) {
  const [isPending, startTransition] = useTransition();

  function handleChange(value: string) {
    startTransition(async () => {
      await setUserRole(userId, value === 'user' ? '' : value);
    });
  }

  return (
    <Select
      value={role === 'admin' ? 'admin' : 'user'}
      onValueChange={handleChange}
      disabled={isPending}
    >
      <SelectTrigger className="h-8 w-24 text-xs">
        <SelectValue />
      </SelectTrigger>
      <SelectContent>
        {ROLES.map((r) => (
          <SelectItem key={r.value} value={r.value} className="text-xs">
            {r.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}