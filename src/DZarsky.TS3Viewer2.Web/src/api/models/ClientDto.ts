/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { ClientType } from './ClientType';

export type ClientDto = {
    id?: number;
    channelId?: number;
    databaseId?: number;
    nickName?: string | null;
    type?: ClientType;
};