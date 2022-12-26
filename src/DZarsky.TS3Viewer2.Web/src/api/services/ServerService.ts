/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageDto } from '../models/MessageDto';
import type { ServerInfoDto } from '../models/ServerInfoDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServerService {

    /**
     * @param requestBody 
     * @returns boolean Success
     * @throws ApiError
     */
    public static postApiV1ServerMessagesGlobal(
requestBody?: MessageDto,
): CancelablePromise<boolean> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/server/messages/global',
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @returns ServerInfoDto Success
     * @throws ApiError
     */
    public static getApiV1ServerInfo(): CancelablePromise<ServerInfoDto> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/server/info',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

}