"use server";
import {createClient} from "@/prismicio";


export const getAllDownloads = async () => {
  const client = createClient();

  const downloads = await client.getAllByType('download', {
    orderings: {
      field: 'document.first_publication_date',
      direction: 'asc',
    },
  });

  // Placeholder function to simulate fetching download data
  return downloads || [];
}
