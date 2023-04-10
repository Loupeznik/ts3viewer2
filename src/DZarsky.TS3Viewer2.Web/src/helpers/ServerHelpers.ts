import { ServerGroupDto, ServerService } from "../api"

const _serverGroupsStorageKey : string = 'api_server_groups'

const getServerGroups = async () : Promise<ServerGroupDto[]> => {
    const serverGroups = await ServerService.getApiV1ServerGroups()
    localStorage.setItem(_serverGroupsStorageKey, JSON.stringify(serverGroups))
    return serverGroups
}

export { getServerGroups }
