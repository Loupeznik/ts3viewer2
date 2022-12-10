﻿using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Models;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Serilog;
using TeamSpeak3QueryApi.Net.Specialized;

namespace DZarsky.TS3Viewer2.Core.Server.Services;

public class TeamSpeakServerService : ITeamSpeakServerService
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

    public async Task<ApiResult<bool>> SendGlobalMessage(MessageDto message)
    {
        try
        {
            await _client.SendGlobalMessage(message.Message);

            return ApiResult.Build(true);
        }
        catch (Exception ex)
        {
            _logger.Error("Could not send global message", ex);

            return ApiResult.Build(false, false);
        }
    }

    public async Task<ApiResult<ServerInfoDto>> GetServerInfo()
    {
        try
        {
            var server = (await _client.GetServers()).FirstOrDefault(x => x.Id == _serverInstance.ServerId);

            return ApiResult.Build(_mapper.Map(server, new ServerInfoDto()));
        }
        catch (Exception ex)
        {
            var message = "Could not get server info";

            _logger.Error(message, ex);

            return ApiResult.Build(new ServerInfoDto(), false, ReasonCodes.NoContent, message);
        }
    }
}
