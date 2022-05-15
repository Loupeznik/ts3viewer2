using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Models;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Serilog;
using TeamSpeak3QueryApi.Net.Specialized;
using TeamSpeak3QueryApi.Net.Specialized.Responses;

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
    
    public async Task<bool> SendGlobalMessage(MessageDto message)
    {
        try
        {
            await _client.SendGlobalMessage(message.Message);

            return true;
        }
        catch (Exception ex)
        {
            _logger.Error("Could not send global message", ex);
            
            return false;
        }
    }

    public async Task<ServerInfoDto?> GetServerInfo()
    {
        try
        {
            var server = (await _client.GetServers()).FirstOrDefault(x => x.Id == _serverInstance.ServerId);

            return _mapper.Map(server, new ServerInfoDto());
        }
        catch (Exception ex)
        {
            _logger.Error("Could not get server info", ex);

            return null;
        }
    }
}
