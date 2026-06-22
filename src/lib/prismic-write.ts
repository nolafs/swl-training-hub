import * as prismic from '@prismicio/client';
import { repositoryName } from '@/prismicio';

export function createWriteClient() {
  return prismic.createWriteClient(repositoryName, {
    writeToken: process.env.PRISMIC_WRITE_TOKEN!,
  });
}