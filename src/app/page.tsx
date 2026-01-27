import { ModuleSlider } from '@/components/features/module';
import { createClient } from '@/prismicio';
import { SliceZone } from "@prismicio/react";
import { components } from "@/slices";
import { notFound } from "next/navigation";
import { PageColorSetter } from "@/components/features/page-color";

export default async function Home() {
  const client = createClient();
  const modules = await client.getAllByType('module', {
    orderings: {
      field: 'my.module.position',
      direction: 'asc',
    },
  });

  const page = await client.getByUID('page', 'home').catch(() => notFound());

  return (
    <main className="flex flex-col h-full w-full flex-1 pt-20 md:pt-28">
      <PageColorSetter color={null} />
      <ModuleSlider modules={modules} />
      <SliceZone slices={page.data.slices} components={components} />
    </main>
  );
}
