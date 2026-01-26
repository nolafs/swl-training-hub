'use client';

import { createContext, useContext, useState, useEffect, useMemo, type ReactNode } from 'react';
import { useStore } from 'zustand';
import { useShallow } from 'zustand/react/shallow';
import {
  createLearnProgressStore,
  type LearnProgressStore,
  type LearnProgressState,
  type CourseStructure,
  type CourseProgress,
  type ModuleProgress,
} from './lean-progress-store';

const LearnProgressStoreContext = createContext<LearnProgressStore | null>(null);

interface LearnProgressStoreProviderProps {
  children: ReactNode;
  courseStructure: CourseStructure;
}

export function LearnProgressStoreProvider({
  children,
  courseStructure,
}: LearnProgressStoreProviderProps) {
  // Create store once with lazy initializer - stable across re-renders
  const [store] = useState(() => createLearnProgressStore(courseStructure));

  // Hydrate persisted state on client mount
  useEffect(() => {
    store.persist.rehydrate();
  }, [store]);


  // Update course structure if it changes (e.g., after CMS update)
  useEffect(() => {
    store.getState().setCourseStructure(courseStructure);
  }, [store, courseStructure]);

  return (
    <LearnProgressStoreContext.Provider value={store}>
      {children}
    </LearnProgressStoreContext.Provider>
  );
}

export function useLearnProgressStore<T>(selector: (state: LearnProgressState) => T): T {
  const store = useContext(LearnProgressStoreContext);

  if (!store) {
    throw new Error('useLearnProgressStore must be used within a LearnProgressStoreProvider');
  }

  return useStore(store, selector);
}

// Convenience hooks for common operations
export function useLessonProgress(lessonId: string): number {
  return useLearnProgressStore(
    useShallow((state) => state.lessonProgress[lessonId]?.progress ?? 0)
  );
}

export function useModuleProgress(moduleId: string): ModuleProgress | null {
  const { courseStructure, lessonProgress } = useLearnProgressStore(
    useShallow((state) => ({
      courseStructure: state.courseStructure,
      lessonProgress: state.lessonProgress,
    }))
  );

  return useMemo(() => {
    const moduleData = courseStructure?.modules.find((m) => m.moduleId === moduleId);
    if (!moduleData) return null;

    const totalLessons = moduleData.lessons.length;
    if (totalLessons === 0) {
      return { moduleId, title: moduleData.title, totalLessons: 0, completedLessons: 0, progress: 0 };
    }

    let totalProgress = 0;
    let completedLessons = 0;

    for (const lesson of moduleData.lessons) {
      const progress = lessonProgress[lesson.lessonId];
      if (progress) {
        totalProgress += progress.progress;
        if (progress.completed) completedLessons++;
      }
    }

    return {
      moduleId,
      title: moduleData.title,
      totalLessons,
      completedLessons,
      progress: Math.round(totalProgress / totalLessons),
    };
  }, [courseStructure, lessonProgress, moduleId]);
}

export function useCourseProgress(): CourseProgress {
  const { courseStructure, lessonProgress } = useLearnProgressStore(
    useShallow((state) => ({
      courseStructure: state.courseStructure,
      lessonProgress: state.lessonProgress,
    }))
  );

  return useMemo(() => {
    if (!courseStructure || courseStructure.modules.length === 0) {
      return { totalModules: 0, completedModules: 0, totalLessons: 0, completedLessons: 0, progress: 0 };
    }

    const totalModules = courseStructure.modules.length;
    let totalLessons = 0;
    let completedLessons = 0;
    let completedModules = 0;
    let totalProgress = 0;

    for (const mod of courseStructure.modules) {
      totalLessons += mod.lessons.length;
      let moduleCompleted = mod.lessons.length > 0;

      for (const lesson of mod.lessons) {
        const progress = lessonProgress[lesson.lessonId];
        if (progress) {
          totalProgress += progress.progress;
          if (progress.completed) {
            completedLessons++;
          } else {
            moduleCompleted = false;
          }
        } else {
          moduleCompleted = false;
        }
      }

      if (moduleCompleted && mod.lessons.length > 0) {
        completedModules++;
      }
    }

    return {
      totalModules,
      completedModules,
      totalLessons,
      completedLessons,
      progress: totalLessons > 0 ? Math.round(totalProgress / totalLessons) : 0,
    };
  }, [courseStructure, lessonProgress]);
}

export function useUpdateLessonProgress() {
  return useLearnProgressStore((state) => state.updateLessonProgress);
}

export function useMarkLessonComplete() {
  return useLearnProgressStore((state) => state.markLessonComplete);
}

export function useCourseStructure() {
  return useLearnProgressStore((state) => state.courseStructure);
}

export function useResetProgress() {
  return useLearnProgressStore((state) => state.resetProgress);
}
