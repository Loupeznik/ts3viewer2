using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Infrastructure.Extensions;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Enums;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Serilog;
using TeamSpeak3QueryApi.Net.Specialized;

namespace DZarsky.TS3Viewer2.Core.Server.Services;

public sealed class TeamSpeakClientService : ITeamSpeakClientService
{
    private readonly TeamSpeakClient _client;
    private readonly ILogger _logger;
    private readonly IMapper _mapper;
    private const string AdminGroup = "Server Admin";

    public TeamSpeakClientService(TeamSpeakClient client, ILogger logger, IMapper mapper)
    {
        _client = client;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<ApiResult<List<ClientDto>>> GetClients(bool? getDetails = false)
    {
        var clients = _mapper.Map(await _client.GetClients(), new List<ClientDto>());

        if (getDetails.GetValueOrDefault())
        {
            foreach (var client in clients)
            {
                var details = await _client.GetClientInfo(client.Id);

                if (details != null)
                {
                    client.Detail = _mapper.Map(details, new ClientDetailDto());
                }
            }
        }

        return clients.ToApiResult();
    }

    public async Task<ApiResult> KickClient(int id)
    {
        try
        {
            await _client.KickClient(id, KickOrigin.Server);

            return ApiResultExtensions.ToApiResult();
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not kick user {id}: {ex}", ex);
            return ApiResultExtensions.ToApiResult(false, ReasonCodes.InvalidArgument, nameof(id));
        }
    }

    public async Task<ApiResult> BanClient(int id, BanClientDto banInfo)
    {
        try
        {
            await _client.BanClient(id, TimeSpan.FromSeconds(banInfo.Duration), banInfo.Reason);

            return ApiResultExtensions.ToApiResult();
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not ban user {id}: {ex}", ex);
            return ApiResultExtensions.ToApiResult(false, ReasonCodes.InvalidArgument, nameof(id));
        }
    }

    public async Task<ApiResult> PokeClient(int id, MessageDto pokeInfo)
    {
        try
        {
            await _client.PokeClient(id, pokeInfo.Message);

            return ApiResultExtensions.ToApiResult();
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not poke user {id}: {ex}", ex);
            return ApiResultExtensions.ToApiResult(false, ReasonCodes.InvalidArgument, nameof(id));
        }
    }

    public async Task<bool> IsClientAdmin(int clientDatabaseId)
    {
        try
        {
            var groupId = (await _client.GetServerGroups())
                .FirstOrDefault(x => x.Name == AdminGroup && x.ServerGroupType == ServerGroupType.NormalGroup)?.Id;

            if (groupId == null)
            {
                _logger.Warning("Server group Server Admin not found");
                return false;
            }

            var isUserInGroup = (await _client.GetServerGroupClientList(groupId.GetValueOrDefault()))
                .Any(x => x.ClientDatabaseId == clientDatabaseId);

            return isUserInGroup;
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not determine whether user is admin: {ex}", ex);
            return false;
        }
    }

    public async Task<int> GetUserFromDatabase(string teamspeakId)
    {
        try
        {
            var id = (await _client.DatabaseIdFromClientUid(teamspeakId)).ClientDatabaseId;

            return id;
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not find user in the database: {ex}", ex);
            return 0;
        }
    }

    public async Task<ApiResult> UpdateClientServerGroup(int clientDatabaseId, int serverGroupId, UpdatePermissionAction action)
    {
        var availableGroups = (await _client.GetServerGroups())
            .Where(x => x.ServerGroupType == ServerGroupType.NormalGroup)
            .ToList();

        if (availableGroups.All(x => x.Id != serverGroupId))
        {
            const string message = "Server group {serverGroupId} was not found or is not assignable";
            _logger.Warning(message);
            return ApiResultExtensions.ToApiResult(false, ReasonCodes.InvalidArgument, message);
        }

        try
        {
            switch(action)
            {
                case UpdatePermissionAction.Add:
                    await _client.AddServerGroup(serverGroupId, clientDatabaseId);
                    break;
                case UpdatePermissionAction.Remove:
                    await _client.RemoveServerGroup(serverGroupId, clientDatabaseId);
                    break;
                default:
                    throw new ArgumentOutOfRangeException(nameof(action), action, null);
            }

            return ApiResultExtensions.ToApiResult();
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not {action} permission {serverGroupId} to user {clientDatabaseId}: {ex}", ex);
            return ApiResultExtensions.ToApiResult(false, ReasonCodes.InternalServerError, ex.Message);
        }
    }
}
