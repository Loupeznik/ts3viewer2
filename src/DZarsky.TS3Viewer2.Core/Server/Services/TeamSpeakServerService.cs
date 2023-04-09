using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Infrastructure.Extensions;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Models;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Serilog;
using TeamSpeak3QueryApi.Net.Specialized;

namespace DZarsky.TS3Viewer2.Core.Server.Services;

public sealed class TeamSpeakServerService : ITeamSpeakServerService
{
    private readonly TeamSpeakClient _client;
    private readonly ILogger _logger;
    private readonly ServerInstance _serverInstance;
    private readonly IMapper _mapper;

    public TeamSpeakServerService(TeamSpeakClient client, ILogger logger, ServerInstance serverInstance, IMapper mapper)
    {
        _client = client;
        _logger = logger;
        _serverInstance = serverInstance;
        _mapper = mapper;
    }

    public async Task<ApiResult> SendGlobalMessage(MessageDto message)
    {
        try
        {
            await _client.SendGlobalMessage(message.Message);

            return ApiResultExtensions.ToApiResult(true);
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not send global message: {ex}", ex);

            return ApiResultExtensions.ToApiResult(false);
        }
    }

    public async Task<ApiResult<ServerInfoDto>> GetServerInfo()
    {
        try
        {
            var server = (await _client.GetServers()).FirstOrDefault(x => x.Id == _serverInstance.ServerId);

            return ApiResultExtensions.ToApiResult(_mapper.Map(server, new ServerInfoDto()));
        }
        catch (Exception ex)
        {
            const string message = "Could not get server info";

            _logger.Error($"{message}: {ex}", ex);

            return ApiResultExtensions.ToApiResult(new ServerInfoDto(), false, ReasonCodes.ExternalServerError, message);
        }
    }

    public async Task<ApiResult<List<ServerGroupDto>>> GetServerGroups(bool? getAll = false)
    {
        try
        {
            var groups = await _client.GetServerGroups();

            if (!getAll.GetValueOrDefault())
            {
                return ApiResultExtensions.ToApiResult(_mapper.Map<List<ServerGroupDto>>(groups.Where(x => x.ServerGroupType == ServerGroupType.NormalGroup).ToList()));
            }

            return ApiResultExtensions.ToApiResult(_mapper.Map<List<ServerGroupDto>>(groups));
        }
        catch (Exception ex)
        {
            const string message = "Could not get server groups";

            _logger.Error($"{message}: {ex}", ex);

            return ApiResultExtensions.ToApiResult(new List<ServerGroupDto>(), false, ReasonCodes.ExternalServerError, message);
        }
    }
}
