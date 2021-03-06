/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { AddFilesResultDto } from '../models/AddFilesResultDto';
import type { FileDto } from '../models/FileDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class FileService {

    /**
     * @returns FileDto Success
     * @throws ApiError
     */
    public static getApiV1Files(): CancelablePromise<Array<FileDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/files',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @param formData 
     * @returns AddFilesResultDto Success
     * @throws ApiError
     */
    public static postApiV1Files(
formData?: {
files?: Array<Blob>;
},
): CancelablePromise<AddFilesResultDto> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/files',
            formData: formData,
            mediaType: 'multipart/form-data',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @param fullFileName 
     * @returns boolean Success
     * @throws ApiError
     */
    public static deleteApiV1Files(
fullFileName: string,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/files/{fullFileName}',
            path: {
                'fullFileName': fullFileName,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

}