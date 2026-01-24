"use server";
import {createClient} from "@/prismicio";


export const getAllDownloads = async () => {
  const client = createClient();

  const downloads = await client.getAllByType('download', {
  });

  // Placeholder function to simulate fetching download data
  return downloads || [];
}
