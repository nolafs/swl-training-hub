'use client';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import {DialogProps} from "@radix-ui/react-dialog";

import { useEffect, useState } from "react";
import {getAllDownloads} from "@/actions/downloads";
import {DownloadDocument} from "../../../../prismicio-types";
import {PrismicNextLink} from "@prismicio/next";


export const DownloadDialog = (props: DialogProps) => {

  const [downloads, setDownloads] = useState<DownloadDocument[] | []>([]);

  useEffect(() => {
    // Fetch downloads from the server or API
    const data = async () => {
      const downloads = await getAllDownloads();
      setDownloads(downloads);
    }

    data();
  }, []);

  return (
    <Dialog {...props}>
      <DialogTrigger>Downloads</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Download</DialogTitle>
          <DialogDescription>
            Additional resources and downloads
          </DialogDescription>
        </DialogHeader>
        {/* List of downloads.ts here */}
        {downloads.length && (
          downloads.map((download) => (
            <PrismicNextLink key={download.id} field={download.data.download}>{download.data.title}</PrismicNextLink>
          ))
        )}
      </DialogContent>
    </Dialog>
  )
}