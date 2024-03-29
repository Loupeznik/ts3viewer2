/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { MessageDto } from '../models/MessageDto';
import type { ServerGroupDto } from '../models/ServerGroupDto';
import type { ServerInfoDto } from '../models/ServerInfoDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ServerService {

    /**
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiV1ServerMessagesGlobal(
requestBody?: MessageDto,
): CancelablePromise<any> {
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

    /**
     * @returns ServerGroupDto Success
     * @throws ApiError
     */
    public static getApiV1ServerGroups(): CancelablePromise<Array<ServerGroupDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/server/groups',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

}