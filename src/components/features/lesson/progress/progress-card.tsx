'use client';
import { motion } from 'framer-motion';
import { useLessonProgress } from '@/lib/store';

export function ProgressCard({ lessonId} : { lessonId: string }) {

  const lessonProgress = useLessonProgress(lessonId);

  return (
    <div className={'flex h-full gap-2.5'}>
      <div className={'flex flex-col items-center justify-between border-white/30'}>
        <div className="text-xs leading-normal font-medium tracking-tight text-gray-50 [text-orientation:mixed] [writing-mode:sideways-lr]">
          {lessonProgress}%
        </div>
        <div className="text-xs leading-normal font-semibold tracking-tight text-gray-50 uppercase [text-orientation:mixed] [writing-mode:sideways-lr]">
          Completed
        </div>
      </div>
      <div className="h-full w-2 overflow-hidden rounded-full bg-gray-200/30">
        <motion.div
          className="w-full rounded-full"
          style={{ backgroundColor: '#ffffff' }}
          initial={{ height: 0 }}
          animate={{ height: `${lessonProgress}%` }}
          transition={{ duration: 0.5, delay: 0.2 }}
        />
      </div>
    </div>
  );
}