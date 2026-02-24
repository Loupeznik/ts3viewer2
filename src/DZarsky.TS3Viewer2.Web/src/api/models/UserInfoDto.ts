/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { UserRoleDto } from './UserRoleDto';
import type { UserType } from './UserType';

export type UserInfoDto = {
    id?: number | null;
    login?: string | null;
    roles?: Array<UserRoleDto> | null;
    type?: UserType;
    isActive?: boolean;
};