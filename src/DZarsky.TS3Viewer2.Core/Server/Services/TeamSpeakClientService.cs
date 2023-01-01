using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Serilog;
using TeamSpeak3QueryApi.Net.Specialized;

namespace DZarsky.TS3Viewer2.Core.Server.Services;

public sealed class TeamSpeakClientService : ITeamSpeakClientService
{
    private readonly TeamSpeakClient _client;
    private readonly ILogger _logger;
    private readonly IMapper _mapper;
    private const string _adminGroup = "Server Admin";

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

        return ApiResult.Build(clients);
    }

    public async Task<ApiResult<bool>> KickClient(int id)
    {
        try
        {
            await _client.KickClient(id, KickOrigin.Server);

            return ApiResult.Build(true);
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not kick user {id}: {ex}", ex);
            return ApiResult.Build(false, false, ReasonCodes.InvalidArgument, nameof(id));
        }
    }

    public async Task<ApiResult<bool>> BanClient(int id, BanClientDto banInfo)
    {
        try
        {
            await _client.BanClient(id, TimeSpan.FromSeconds(banInfo.Duration), banInfo.Reason);

            return ApiResult.Build(true);
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not ban user {id}: {ex}", ex);
            return ApiResult.Build(false, false, ReasonCodes.InvalidArgument, nameof(id));
        }
    }

    public async Task<ApiResult<bool>> PokeClient(int id, MessageDto pokeInfo)
    {
        try
        {
            await _client.PokeClient(id, pokeInfo.Message);

            return ApiResult.Build(true);
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not poke user {id}: {ex}", ex);
            return ApiResult.Build(false, false, ReasonCodes.InvalidArgument, nameof(id));
        }
    }

    public async Task<bool> IsClientAdmin(int clientDatabaseId)
    {
        try
        {
            var groupId = (await _client.GetServerGroups())
                .FirstOrDefault(x => x.Name == _adminGroup && x.ServerGroupType == ServerGroupType.NormalGroup)?.Id;

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
}
