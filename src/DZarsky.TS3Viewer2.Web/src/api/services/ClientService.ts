/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { BanClientDto } from '../models/BanClientDto';
import type { ClientDto } from '../models/ClientDto';
import type { MessageDto } from '../models/MessageDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class ClientService {

    /**
     * @param getDetail 
     * @returns ClientDto Success
     * @throws ApiError
     */
    public static getApiV1ServerClients(
getDetail?: boolean,
): CancelablePromise<Array<ClientDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/server/clients',
            query: {
                'getDetail': getDetail,
            },
            errors: {
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @param id 
     * @returns any Success
     * @throws ApiError
     */
    public static getApiV1ServerClientsKick(
id: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/server/clients/{id}/kick',
            path: {
                'id': id,
            },
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
    public static postApiV1ServerClientsBan(
id: number,
requestBody?: BanClientDto,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/server/clients/{id}/ban',
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

    /**
     * @param id 
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiV1ServerClientsPoke(
id: number,
requestBody?: MessageDto,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/server/clients/{id}/poke',
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

    /**
     * @param id 
     * @param permissionId 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiV1ServerClientsPermissions(
id: number,
permissionId?: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/server/clients/{id}/permissions',
            path: {
                'id': id,
            },
            query: {
                'permissionId': permissionId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Server Error`,
            },
        });
    }

    /**
     * @param id 
     * @param permissionId 
     * @returns any Success
     * @throws ApiError
     */
    public static deleteApiV1ServerClientsPermissions(
id: number,
permissionId?: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/server/clients/{id}/permissions',
            path: {
                'id': id,
            },
            query: {
                'permissionId': permissionId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
                500: `Server Error`,
            },
        });
    }

}