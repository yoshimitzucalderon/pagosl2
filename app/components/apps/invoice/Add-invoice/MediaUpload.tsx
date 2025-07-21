"use client";
import CardBox from "@/app/components/shared/CardBox";
import { FileInput, Label } from "flowbite-react";
import React from "react";
import { Icon } from "@iconify/react";

const MediaUpload = ({ onFileUpload }: { onFileUpload?: (file: File) => void }) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0] && onFileUpload) {
      onFileUpload(e.target.files[0]);
    }
  };
  return (
    <CardBox>
      <h5 className="card-title mb-4">Media</h5>
      <div className="flex w-full items-center justify-center">
        <Label
          htmlFor="dropzone-file"
          className="flex h-64 w-full cursor-pointer flex-col items-center justify-center rounded-lg border-[1px] border-dashed border-primary bg-lightprimary"
        >
          <div className="flex flex-col items-center justify-center pb-6 pt-5">
            <Icon
              icon="solar:cloud-upload-outline"
              height={32}
              className="mb-3 text-darklink"
            />
            <p className="mb-2 text-sm text-darklink text-center">
              <span className="font-semibold">Haga clic para subir</span> o arrastre y suelte el archivo
            </p>
            <p className="text-xs text-darklink text-center">
              (Tamaño máximo: 10 MB)
            </p>
          </div>
          <FileInput id="dropzone-file" className="hidden" onChange={handleChange} />
        </Label>
      </div>
    </CardBox>
  );
};

export default MediaUpload; 