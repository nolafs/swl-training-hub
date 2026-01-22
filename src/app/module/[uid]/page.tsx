import { LessonSlider } from "@/components/LessonSlider";

// Placeholder data - will be replaced with Prismic CMS data
const mockLessons = [
  {
    id: "lesson-1",
    lessonNumber: 1,
    title: "Introduction",
    description: "Getting started with the basics",
    duration: "5 min",
  },
  {
    id: "lesson-2",
    lessonNumber: 2,
    title: "Core Concepts",
    description: "Understanding the fundamentals",
    duration: "10 min",
  },
  {
    id: "lesson-3",
    lessonNumber: 3,
    title: "Advanced Topics",
    description: "Diving deeper into the subject",
    duration: "15 min",
  },
];

interface ModulePageProps {
  params: Promise<{ uid: string }>;
}

export default async function ModulePage({ params }: ModulePageProps) {
  const { uid } = await params;

  // TODO: Fetch module data from Prismic
  const moduleColor = "#3B82F6"; // Placeholder - will come from CMS

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto py-12">
        <h1 className="text-3xl font-bold mb-8 px-10">Module {uid}</h1>
        <LessonSlider
          lessons={mockLessons}
          moduleId={uid}
          moduleColor={moduleColor}
        />
      </div>
    </main>
  );
}