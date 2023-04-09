/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ServerGroupType } from './ServerGroupType';

export type ServerGroupDto = {
    id?: number;
    name?: string | null;
    serverGroupType?: ServerGroupType;
};