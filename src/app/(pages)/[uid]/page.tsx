import type { Metadata, ResolvingMetadata } from 'next';
import { notFound } from 'next/navigation';
import { SliceZone } from '@prismicio/react';
import { createClient } from '@/prismicio';
import { components } from '@/slices';
import React from 'react';
import {asImageSrc, isFilled} from '@prismicio/client';
import type {ResolvedOpenGraph} from 'next/dist/lib/metadata/types/opengraph-types';
import SchemaInjector from '@/utils/schema-injection';

type Params = { uid: string };


export async function generateMetadata(
  { params }: { params: Promise<Params> },
  parent: ResolvingMetadata,
): Promise<Metadata> {
  const client = createClient();
  const { uid } = await params;
  const page = await client.getByUID('page', uid).catch(() => notFound());

  let pageTitle = '';
  const parentMeta = await parent;
  const parentOpenGraph: ResolvedOpenGraph | null = parentMeta.openGraph ?? null;

  if (parentMeta?.title) {
    pageTitle = parentMeta.title.absolute;
  }


  return {
    metadataBase: new URL(
       `${process.env.NEXT_PUBLIC_BASE_URL}/${page.uid}`
    ),
    alternates: {
      canonical:  `${process.env.NEXT_PUBLIC_BASE_URL}/${page.uid}`,
      types: {
        'application/rss+xml': `${process.env.NEXT_PUBLIC_BASE_URL}/feed.xml`,
      },
    },
    title: `${isFilled.keyText(page.data.meta_title) ? page.data.meta_title : pageTitle}`,
    description: page.data.meta_description ?? parentMeta.description,
    openGraph: {
      title: isFilled.keyText(page.data.meta_title) ? page.data.meta_title : pageTitle,
      description: isFilled.keyText(page.data.meta_description) ? page.data.meta_description : '',
      images: isFilled.image(page.data.meta_image) ? [asImageSrc(page.data.meta_image)] : parentOpenGraph?.images ?? [],
    },
  };
}

export default async function Page({ params }: { params: Promise<Params> }) {
  const client = createClient();
  const { uid } = await params;
  const page = await client.getByUID('page', uid).catch(() => notFound());

  return (
    <main className={'w-full overflow-hidden'}>
        <SliceZone slices={page.data.slices} components={components} />
      <SchemaInjector uid={uid} />
    </main>
  );
}

export async function generateStaticParams() {
  const client = createClient();

  const pages = await client.getAllByType('page');

  return pages.map(page => {
    return { uid: page.uid };
  });
}
