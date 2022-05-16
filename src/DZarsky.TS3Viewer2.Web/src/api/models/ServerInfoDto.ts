/* istanbul ignore file */
/* tslint:disable */
/* eslint-disable */

export type ServerInfoDto = {
    id?: number;
    status?: string | null;
    clientsOnline?: number;
    queriesOnline?: number;
    maxClients?: number;
    uptime?: string | null;
    name?: string | null;
};