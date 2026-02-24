import { CheckCircle2, Upload as UploadIcon, XCircle } from "lucide-react";
import React, { useRef } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useUploadFile } from "@/hooks/useFiles";

export const UploadPage = () => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const uploadMutation = useUploadFile();
  const [successfulUploads, setSuccessfulUploads] = React.useState<string[]>([]);
  const [failedUploads, setFailedUploads] = React.useState<string[]>([]);

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files.length > 0) {
      const fileArray = Array.from(files);
      uploadMutation.mutate(fileArray, {
        onSuccess: (res) => {
          setSuccessfulUploads(res.successful || []);
          setFailedUploads(res.failed || []);
          if (fileInputRef.current) {
            fileInputRef.current.value = "";
          }
        },
        onError: () => {
          setFailedUploads([]);
          setSuccessfulUploads([]);
        },
      });
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex items-center justify-center min-h-screen p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UploadIcon className="size-5" />
            Upload Files
          </CardTitle>
          <CardDescription>Select files to upload to the server</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Input
              ref={fileInputRef}
              type="file"
              multiple
              onChange={handleFileSelect}
              disabled={uploadMutation.isPending}
              className="cursor-pointer"
            />
          </div>

          <Button onClick={handleUploadClick} disabled={uploadMutation.isPending} className="w-full">
            {uploadMutation.isPending ? "Uploading..." : "Upload"}
          </Button>

          {successfulUploads.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-green-600 dark:text-green-400">
                <CheckCircle2 className="size-4" />
                Successful
              </div>
              <ul className="space-y-1 text-sm">
                {successfulUploads.map((filename) => (
                  <li key={filename} className="text-green-600 dark:text-green-400">
                    {filename}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {failedUploads.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm font-semibold text-red-600 dark:text-red-400">
                <XCircle className="size-4" />
                Failed
              </div>
              <ul className="space-y-1 text-sm">
                {failedUploads.map((filename) => (
                  <li key={filename} className="text-red-600 dark:text-red-400">
                    {filename}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
