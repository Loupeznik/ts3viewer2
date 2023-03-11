/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TokenResult } from '../models/TokenResult';
import type { UserDto } from '../models/UserDto';
import type { UserInfoDto } from '../models/UserInfoDto';

import type { CancelablePromise } from '../core/CancelablePromise';
import { OpenAPI } from '../core/OpenAPI';
import { request as __request } from '../core/request';

export class UserService {

    /**
     * @param requestBody 
     * @returns any Success
     * @throws ApiError
     */
    public static postApiV1Users(
requestBody?: UserDto,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users',
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
     * @param onlyActive 
     * @returns UserInfoDto Success
     * @throws ApiError
     */
    public static getApiV1Users(
onlyActive: boolean = true,
): CancelablePromise<Array<UserInfoDto>> {
        return __request(OpenAPI, {
            method: 'GET',
            url: '/api/v1/users',
            query: {
                'onlyActive': onlyActive,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @param userId 
     * @param requestBody 
     * @returns UserInfoDto Success
     * @throws ApiError
     */
    public static putApiV1Users(
userId: number,
requestBody?: UserInfoDto,
): CancelablePromise<UserInfoDto> {
        return __request(OpenAPI, {
            method: 'PUT',
            url: '/api/v1/users/{userId}',
            path: {
                'userId': userId,
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
     * @param userId 
     * @returns any Success
     * @throws ApiError
     */
    public static deleteApiV1Users(
userId: number,
): CancelablePromise<any> {
        return __request(OpenAPI, {
            method: 'DELETE',
            url: '/api/v1/users/{userId}',
            path: {
                'userId': userId,
            },
            errors: {
                400: `Bad Request`,
                401: `Unauthorized`,
                403: `Forbidden`,
            },
        });
    }

    /**
     * @param requestBody 
     * @returns TokenResult Success
     * @throws ApiError
     */
    public static postApiV1UsersAuthToken(
requestBody?: UserDto,
): CancelablePromise<TokenResult> {
        return __request(OpenAPI, {
            method: 'POST',
            url: '/api/v1/users/auth/token',
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