using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Serilog;
using TeamSpeak3QueryApi.Net.Specialized;

namespace DZarsky.TS3Viewer2.Core.Server.Services;

public class TeamSpeakServerService : ITeamSpeakServerService
{
    private readonly TeamSpeakClient _client;
    private readonly ILogger _logger;

    public TeamSpeakServerService(TeamSpeakClient client, ILogger logger)
    {
        _client = client;
        _logger = logger;
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
}
