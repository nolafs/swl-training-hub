import { ModuleSlider } from "@/components/features/module";
import {createClient} from "@/prismicio";


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

export default async function  Home() {

    const client = createClient();
    const modules = await client.getAllByType('module', {
      orderings: {
        field: 'my.module.position',
        direction: 'asc',
      },
    });


  return (
    <main className="w-full h-full flex-1">
      <div className="container mx-auto py-12">
        <ModuleSlider modules={modules} />
      </div>
    </main>
);
}