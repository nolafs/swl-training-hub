import { createStore } from 'zustand';
import { persist, createJSONStorage, type StateStorage } from 'zustand/middleware';

// Safe localStorage wrapper that handles SSR
const safeLocalStorage: StateStorage = {
  getItem: (name) => {
    if (typeof window === 'undefined') return null;
    return localStorage.getItem(name);
  },
  setItem: (name, value) => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(name, value);
  },
  removeItem: (name) => {
    if (typeof window === 'undefined') return;
    localStorage.removeItem(name);
  },
};

// Course structure from CMS - defines what modules/lessons exist
export interface CourseLesson {
  lessonId: string;
  title: string;
}

export interface CourseModule {
  moduleId: string;
  title: string;
  lessons: CourseLesson[];
}

export interface CourseStructure {
  modules: CourseModule[];
}

// Lesson progress - tracks individual lesson completion percentage
export interface LessonProgress {
  lessonId: string;
  moduleId: string;
  progress: number; // 0-100 percentage (can be based on video watch time)
  completed: boolean; // true when progress >= 100
  lastUpdated: number; // timestamp
}

// Module progress - calculated from lessons
export interface ModuleProgress {
  moduleId: string;
  title: string;
  totalLessons: number;
  completedLessons: number;
  progress: number; // 0-100 percentage (average of all lessons)
}

// Overall course progress
export interface CourseProgress {
  totalModules: number;
  completedModules: number;
  totalLessons: number;
  completedLessons: number;
  progress: number; // 0-100 percentage
}

export interface LearnProgressState {
  // State
  courseStructure: CourseStructure | null; // from CMS, not persisted
  lessonProgress: Record<string, LessonProgress>; // keyed by lessonId, persisted

  // Actions
  setCourseStructure: (structure: CourseStructure) => void;
  updateLessonProgress: (lessonId: string, moduleId: string, progress: number) => void;
  markLessonComplete: (lessonId: string, moduleId: string) => void;
  getLessonProgress: (lessonId: string) => number;
  getModuleProgress: (moduleId: string) => ModuleProgress | null;
  getCourseProgress: () => CourseProgress;
  resetProgress: () => void;
  resetModuleProgress: (moduleId: string) => void;
}

export const createLearnProgressStore = (initialStructure?: CourseStructure) => {
  return createStore<LearnProgressState>()(
    persist(
      (set, get) => ({
        courseStructure: initialStructure ?? null,
        lessonProgress: {},

        setCourseStructure: (structure: CourseStructure) => {
          set({ courseStructure: structure });
        },

        updateLessonProgress: (lessonId: string, moduleId: string, progress: number) => {
          const clampedProgress = Math.min(100, Math.max(0, progress));
          set((state) => ({
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                lessonId,
                moduleId,
                progress: clampedProgress,
                completed: clampedProgress >= 100,
                lastUpdated: Date.now(),
              },
            },
          }));
        },

        markLessonComplete: (lessonId: string, moduleId: string) => {
          set((state) => ({
            lessonProgress: {
              ...state.lessonProgress,
              [lessonId]: {
                lessonId,
                moduleId,
                progress: 100,
                completed: true,
                lastUpdated: Date.now(),
              },
            },
          }));
        },

        getLessonProgress: (lessonId: string) => {
          const lesson = get().lessonProgress[lessonId];
          return lesson?.progress ?? 0;
        },

        getModuleProgress: (moduleId: string) => {
          const { courseStructure, lessonProgress } = get();
          const mod = courseStructure?.modules.find((m) => m.moduleId === moduleId);

          if (!mod) return null;

          const totalLessons = mod.lessons.length;
          if (totalLessons === 0) {
            return {
              moduleId,
              title: mod.title,
              totalLessons: 0,
              completedLessons: 0,
              progress: 0,
            };
          }

          // Calculate progress based on all lessons in the module
          let totalProgress = 0;
          let completedLessons = 0;

          for (const lesson of mod.lessons) {
            const progress = lessonProgress[lesson.lessonId];
            if (progress) {
              totalProgress += progress.progress;
              if (progress.completed) completedLessons++;
            }
          }

          return {
            moduleId,
            title: mod.title,
            totalLessons,
            completedLessons,
            progress: Math.round(totalProgress / totalLessons),
          };
        },

        getCourseProgress: () => {
          const { courseStructure, lessonProgress } = get();

          if (!courseStructure || courseStructure.modules.length === 0) {
            return {
              totalModules: 0,
              completedModules: 0,
              totalLessons: 0,
              completedLessons: 0,
              progress: 0,
            };
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
        },

        resetProgress: () => {
          set({ lessonProgress: {} });
        },

        resetModuleProgress: (moduleId: string) => {
          set((state) => {
            const filtered = Object.fromEntries(
              Object.entries(state.lessonProgress).filter(
                ([, lesson]) => lesson.moduleId !== moduleId
              )
            );
            return { lessonProgress: filtered };
          });
        },
      }),
      {
        name: 'swl-learn-progress',
        storage: createJSONStorage(() => safeLocalStorage),
        // Only persist lessonProgress, not courseStructure (comes from CMS)
        partialize: (state) => ({ lessonProgress: state.lessonProgress }),
        // Skip hydration during SSR to avoid mismatches
        skipHydration: true,
      }
    )
  );
};

export type LearnProgressStore = ReturnType<typeof createLearnProgressStore>;
