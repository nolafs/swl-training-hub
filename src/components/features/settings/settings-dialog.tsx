'use client';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { useResetProgress } from '@/lib/store';
import { SettingsIcon } from 'lucide-react';

export function SettingsDialog() {
  const resetProgress = useResetProgress();

  const handleResetProgress = () => {
    resetProgress();
  };

  return (
    <Dialog>
      <DialogTrigger>
        <SettingsIcon />
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Settings</DialogTitle>
          <DialogDescription>LMS App Settings</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Reset Progress</p>
              <p className="text-sm text-muted-foreground">
                Clear all lesson and module progress
              </p>
            </div>
            <Button variant="destructive" onClick={handleResetProgress}>
              Reset
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}