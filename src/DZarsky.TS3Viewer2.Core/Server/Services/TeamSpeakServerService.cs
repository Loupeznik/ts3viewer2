using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Serilog;
using TeamSpeak3QueryApi.Net.Specialized;
using TeamSpeak3QueryApi.Net.Specialized.Responses;

namespace DZarsky.TS3Viewer2.Core.Server.Services;

public class TeamSpeakServerService : ITeamSpeakServerService
{
    private readonly TeamSpeakClient _client;
    private readonly ILogger _logger;
    private readonly IMapper _mapper;

    public TeamSpeakServerService(TeamSpeakClient client, ILogger logger, IMapper mapper)
    {
        _client = client;
        _logger = logger;
        _mapper = mapper;
    }
    
    public async Task<IList<ClientDto>> GetClients()
    {
        var clients = _mapper.Map(await _client.GetClients(), new List<ClientDto>());
        
        return clients;
    }

    public async Task<bool> KickClient(int id)
    {
        try
        {
            await _client.KickClient(id, KickOrigin.Server);

            return true;
        }
        catch (Exception ex)
        {
            _logger.Error($"Could not kick user {id}", ex);
            return false;
        }
    }
}
