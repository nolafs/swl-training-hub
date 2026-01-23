import { ModuleSlider } from "@/components/features/module";

// Placeholder data - will be replaced with Prismic CMS data
const mockModules = [
  {
    id: "module-1",
    moduleNumber: 1,
    title: "Getting Started",
    description: "Introduction to the fundamentals and core concepts",
    color: "#3B82F6",
    progress: 75,
    lessons: [
      { id: "lesson-1", title: "Introduction" },
      { id: "lesson-2", title: "Setup" },
    ],
  },
  {
    id: "module-2",
    moduleNumber: 2,
    title: "Core Concepts",
    description: "Deep dive into the essential building blocks",
    color: "#10B981",
    progress: 30,
    lessons: [
      { id: "lesson-1", title: "Basics" },
      { id: "lesson-2", title: "Advanced" },
    ],
  },
  {
    id: "module-3",
    moduleNumber: 3,
    title: "Advanced Topics",
    description: "Master advanced techniques and best practices",
    color: "#F59E0B",
    progress: 0,
    lessons: [
      { id: "lesson-1", title: "Optimization" },
    ],
  },
  {
    id: "module-4",
    moduleNumber: 4,
    title: "Real-World Projects",
    description: "Apply your knowledge to practical scenarios",
    color: "#EF4444",
    progress: 0,
    lessons: [],
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-zinc-50">
      <div className="container mx-auto py-12">
        <h1 className="text-4xl font-bold text-center mb-4">
          SWL Training Hub
        </h1>


        <p className="text-center text-zinc-600 dark:text-zinc-400 mb-12">
          Select a module to begin your learning journey
        </p>
        <ModuleSlider modules={mockModules} />
      </div>
    </main>
  );
}