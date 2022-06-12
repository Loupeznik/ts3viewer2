import React, { useEffect, useState } from 'react';
import { AddFilesResultDto, ApiError, FileService } from "../api";
import { Input } from '../components/forms/Input';
import { SubmitButton } from '../components/forms/SubmitButton';

export const UploadPage = () => {
    const [files, setFiles] = useState<FileList>()
    const [successfulUploads, setSuccessfulUploads] = useState<Array<string>>()
    const [failedUploads, setFailedUploads] = useState<Array<string>>()

    const changeHandler = (event: React.ChangeEvent<HTMLInputElement>) => {
        if (event.target.files && event.target.files.length > 0) {
            setFiles(event.target.files)
        }
    };

    const handleSubmission = async () => {
        const filesToUpload = new Array<Blob>()

        if (files !== undefined && files?.length > 0) {
            for (let i = 0; i < files?.length; i++) {
                filesToUpload.push(files[i])
            }
        }

        await FileService.postApiV1Files({ files: filesToUpload }).catch(err => {
            if (err instanceof ApiError) {
                const res = err.body as AddFilesResultDto

                if (res.failed && res.failed?.length > 0) {
                    setFailedUploads(res.failed)
                }
            }
        }).then((res) => {
            if (res) {
                if (res.successful && res.successful?.length > 0) {
                    setSuccessfulUploads(res.successful)
                }

                if (res.failed && res.failed?.length > 0) {
                    setFailedUploads(res.failed)
                }
            }
        })
    }

    useEffect(() => {

    }, [successfulUploads, failedUploads]);

    function renderFailedUploads() {
        if (failedUploads && failedUploads?.length > 0) {
            return (
                <ul>
                    {failedUploads?.map((filename, index) =>
                        (<li key={index}>{filename}</li>)
                    )}
                </ul>
            )
        }

        return (
            <p>-</p>
        )
    }

    function renderSuccessfulUploads() {
        if (successfulUploads && successfulUploads?.length > 0) {
            return (
                <ul>
                    {successfulUploads?.map((filename, index) =>
                        (<li key={index}>{filename}</li>)
                    )}
                </ul>
            )
        }
        
        return (
            <p>-</p>
        )
    }

    function renderUploadResult() {
        if (successfulUploads || failedUploads)
        {
            return (
                <div>
                    <div className="p-4 mb-4 text-sm text-green-700 bg-green-100 rounded-lg dark:bg-green-200 dark:text-green-800" role="alert">
                        <span className="font-bold text-lg">Successful</span>
                        {renderSuccessfulUploads()}
                    </div>
                    <div className="p-4 mb-4 text-sm text-red-700 bg-red-100 rounded-lg dark:bg-red-200 dark:text-red-800" role="alert">
                        <span className="font-bold text-lg">Failed</span>
                        {renderFailedUploads()}
                    </div>
                </div>
            )
        }
    }

    return (
        <div>
            <div
                className="p-4 w-full text-center bg-white border shadow-md sm:p-8 dark:bg-gray-800 dark:border-gray-700">
                <h1 className="mb-2 text-3xl font-bold text-gray-900 dark:text-white">Upload files</h1>
                <div className="justify-center items-center space-y-4 sm:flex sm:space-y-0 sm:space-x-4">
                    <div
                        className="w-full mt-3 md:w-1/4 bg-gray-800 text-white rounded-lg inline-flex items-center justify-center px-4 py-2.5 dark:bg-gray-700">
                        <div className="flex flex-col gap-4">
                            <Input type="file" id="files" onChange={changeHandler} />

                            <SubmitButton value="Upload" onClick={handleSubmission} />
                            {renderUploadResult()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
