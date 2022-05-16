/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

import type { Codec } from './Codec';

export type ChannelDto = {
    id?: number;
    parentChannelId?: number;
    order?: number;
    name?: string | null;
    topic?: string | null;
    isDefaultChannel?: boolean;
    hasPassword?: boolean;
    isPermanent?: boolean;
    isSemiPermanent?: boolean;
    codec?: Codec;
    codecQuality?: number;
    neededTalkPower?: number;
    iconId?: number;
    durationEmpty?: string | null;
    totalFamilyClients?: number;
    maxClients?: number;
    maxFamilyClients?: number;
    totalClients?: number;
    neededSubscribePower?: number;
};