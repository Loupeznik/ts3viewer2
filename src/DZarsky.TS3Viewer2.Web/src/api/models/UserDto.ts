/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Permission } from './Permission';

export type UserDto = {
    login?: string | null;
    secret?: string | null;
    permissions?: Array<Permission> | null;
};