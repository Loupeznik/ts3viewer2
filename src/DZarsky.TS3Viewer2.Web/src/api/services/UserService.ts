/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */
import type { TokenResult } from '../models/TokenResult';
import type { UserDto } from '../models/UserDto';

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