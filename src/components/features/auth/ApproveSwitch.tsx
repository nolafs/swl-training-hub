'use client';

import { useState, useTransition } from 'react';
import { Switch } from '@/components/ui/switch';
import { approveUser, revokeUser } from '@/actions/admin';

interface ApproveSwitchProps {
  userId: string;
  approved: boolean;
}

export function ApproveSwitch({ userId, approved }: ApproveSwitchProps) {
  const [checked, setChecked] = useState(approved);
  const [isPending, startTransition] = useTransition();

  function handleChange(value: boolean) {
    setChecked(value);
    startTransition(async () => {
      if (value) {
        await approveUser(userId);
      } else {
        await revokeUser(userId);
      }
    });
  }

  return (
    <Switch
      checked={checked}
      onCheckedChange={handleChange}
      disabled={isPending}
      aria-label="Toggle user approval"
      className="data-[state=unchecked]:bg-gray-300"
    />
  );
}