/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { ChannelDto } from '../models/ChannelDto';
import type { MessageDto } from '../models/MessageDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ChannelService {

    /**
     * @returns ChannelDto Success
     * @throws ApiError
     */
    public static getApiV1ServerChannels(): CancelablePromise<Array<ChannelDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/server/channels',
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @param id 
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiV1ServerChannelsMessage(
id: number,
requestBody?: MessageDto,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/server/channels/{id}/message',
            path: {
                'id': id,
            },
            body: requestBody,
            mediaType: 'application/json',
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

}