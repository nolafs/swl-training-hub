import { createClient } from "@/prismicio";
import { notFound } from "next/navigation";
import { PageColorSetter } from "@/components/features/page-color";

interface LessonPageProps {
  params: Promise<{ uid: string; lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { uid, lessonId } = await params;
  const client = createClient();

  // Fetch module to get the color
  const moduleDoc = await client.getByUID('module', uid).catch(() => null);

  if (!moduleDoc) {
    notFound();
  }

  const moduleColor = moduleDoc.data.colour || '#fff';

  return (
    <main className="min-h-screen flex-1">
      <PageColorSetter color={moduleColor} />
      <div className="container mx-auto px-6 py-12">
        <nav className="mb-8">
          <a
            href={`/module/${uid}`}
            className="flex items-center gap-2 text-white/80 hover:text-white"
          >
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M19 12H5M12 19l-7-7 7-7" />
            </svg>
            Back to Module
          </a>
        </nav>

        <article className="mx-auto max-w-4xl rounded-xl bg-white/95 p-8 shadow-lg backdrop-blur">
          <h1 className="mb-6 text-3xl font-bold">Lesson {lessonId}</h1>
          <div className="prose max-w-none">
            <p className="text-zinc-600">
              Lesson content will be loaded from Prismic CMS.
            </p>
            {/* Video player, text content, and interactive elements will go here */}
          </div>
        </article>
      </div>
    </main>
  );
}
