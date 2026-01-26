'use client';

import { Progress } from '@/components/ui/progress';
import { useCourseProgress } from '@/lib/store';


export function CourseProgress() {

  const course = useCourseProgress();

  console.log('COURSE', course);

  return (<div>
    <Progress value={course.progress} color={'#000000'}  />
  </div>);
}