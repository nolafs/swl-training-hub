interface LessonPageProps {
  params: Promise<{ uid: string; lessonId: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { uid, lessonId } = await params;

  // TODO: Fetch lesson content from Prismic CMS

  return (
    <main className="min-h-screen bg-zinc-50 dark:bg-black">
      <div className="container mx-auto py-12 px-6">
        <nav className="mb-8">
          <a
            href={`/module/${uid}`}
            className="text-blue-600 hover:text-blue-800 flex items-center gap-2"
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

        <article className="bg-white dark:bg-zinc-900 rounded-xl p-8 shadow-lg max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-6">Lesson {lessonId}</h1>
          <div className="prose dark:prose-invert max-w-none">
            <p className="text-zinc-600 dark:text-zinc-400">
              Lesson content will be loaded from Prismic CMS.
            </p>
            {/* Video player, text content, and interactive elements will go here */}
          </div>
        </article>
      </div>
    </main>
  );
}
