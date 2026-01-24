import React from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { AlertCircle, TriangleAlert, Info, Check } from 'lucide-react';

interface NotificationProps {
  body?: string;
  type?: 'error' | 'success' | 'info' | 'warning';
}

export const Notification = ({ body, type }: NotificationProps) => {
  if (type === 'success') {
    return (
      <Alert variant="default">
        <Check className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>{body}</AlertDescription>
      </Alert>
    );
  }

  if (type === 'info') {
    return (
      <Alert variant="default">
        <Info className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>{body}</AlertDescription>
      </Alert>
    );
  }

  if (type === 'warning') {
    return (
      <Alert variant="default">
        <TriangleAlert className="h-4 w-4" />
        <AlertTitle>Warning</AlertTitle>
        <AlertDescription>{body}</AlertDescription>
      </Alert>
    );
  }

  if (type === 'error') {
    return (
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>{body}</AlertDescription>
      </Alert>
    );
  }
};

export default Notification;
