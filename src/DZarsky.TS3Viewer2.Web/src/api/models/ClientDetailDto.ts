/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ClientDetailDto = {
    version?: string | null;
    plattform?: string | null;
    description?: string | null;
    inputMuted?: boolean;
    outputMuted?: boolean;
    outputOnlyMuted?: boolean;
    isRecording?: boolean;
    serverGroupIds?: Array<number> | null;
    channelGroupsIds?: Array<number> | null;
    totalConnectionCount?: number;
    away?: boolean;
    isClientTalking?: boolean;
    awayMessage?: string | null;
};