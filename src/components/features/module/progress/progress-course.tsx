'use client';

import { Progress } from '@/components/ui/progress';
import { useCourseProgress } from '@/lib/store';

export function CourseProgress() {

  const course = useCourseProgress();

  return (<div>
    <Progress value={course.progress} />
  </div>);
}