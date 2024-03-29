﻿using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Infrastructure.Extensions;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Serilog;
using TeamSpeak3QueryApi.Net.Specialized;

namespace DZarsky.TS3Viewer2.Core.Server.Services;

public sealed class TeamSpeakChannelService : ITeamSpeakChannelService
{
    private readonly TeamSpeakClient _client;
    private readonly ILogger _logger;
    private readonly IMapper _mapper;

    public TeamSpeakChannelService(TeamSpeakClient client, ILogger logger, IMapper mapper)
    {
        _client = client;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<ApiResult> SendMessage(int id, MessageDto message)
    {
        if (string.IsNullOrWhiteSpace(message.Message))
        {
            return ApiResultExtensions.ToApiResult(false, ReasonCodes.NullArgumentException, nameof(message.Message));
        }

        try
        {
            await _client.SendMessage(message.Message, MessageTarget.Channel, id);

            return ApiResultExtensions.ToApiResult(true);
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not send message to channel {id}: {ex}", ex);
            return ApiResultExtensions.ToApiResult(false);
        }
    }

    public async Task<ApiResult<List<ChannelDto>>> GetChannels()
    {
        var channels = _mapper.Map(await _client.GetChannels(), new List<ChannelDto>());

        return channels.ToApiResult();
    }
}
