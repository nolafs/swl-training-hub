'use client';

import { Progress } from '@/components/ui/progress';
import { useModuleProgress } from '@/lib/store';

interface ModuleProgress {
  moduleId: string;
}

export function ModuleProgress({moduleId}: ModuleProgress) {

  const moduleData = useModuleProgress(moduleId);

  return (
    <div>
      <Progress value={moduleData?.progress} color={'#ffffff'} />
    </div>
  );
}