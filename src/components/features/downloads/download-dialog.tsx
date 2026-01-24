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
import {ButtonHero} from "@/components/ui/button-hero";
import {DownloadIcon} from "lucide-react";
import {Badge} from "@/components/ui/badge";
import {ScrollArea} from "@/components/ui/scroll-area";


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
      <DialogTrigger asChild>
        <ButtonHero  icon={<DownloadIcon />} textBgColor={'#331f1f'} textColor={'#fff'} iconBgColor={'#E55D5D'} >Downloads</ButtonHero>
      </DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>Download</DialogTitle>
          <DialogDescription>
            Additional resources and downloads
          </DialogDescription>
        </DialogHeader>
        {/* List of downloads.ts here */}
        <ScrollArea className="h-[350px] w-full rounded-md border p-4">
        <ul className={'space-y-2'}>
        {downloads.length && (
          downloads.map((download) => (<li key={download.id}  className={'block border border-gray-100 rounded-md bg-gray-50 hover:bg-gray-800 hover:text-white'}>
            <PrismicNextLink field={download.data.download}className="flex items-center justify-between">
                <div className={'p-4 flex flex-col space-y-2.5'}>
                  <h4 className={'flex items-center space-x-1.5'}><span className={'font-semibold text-2xl'}>{download.data.title}</span><Badge >{download.data.file_type}</Badge></h4>
                  <p className={'font-extralight text-sm'}>{download.data.description}</p>
                </div>
                <div className={'p-4'}>
                <DownloadIcon />
                </div>
              </PrismicNextLink>
          </li>
          ))
        )}
        </ul>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  )
}