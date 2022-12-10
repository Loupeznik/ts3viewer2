using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Serilog;
using TeamSpeak3QueryApi.Net.Specialized;

namespace DZarsky.TS3Viewer2.Core.Server.Services;

public class TeamSpeakClientService : ITeamSpeakClientService
{
    private readonly TeamSpeakClient _client;
    private readonly ILogger _logger;
    private readonly IMapper _mapper;

    public TeamSpeakClientService(TeamSpeakClient client, ILogger logger, IMapper mapper)
    {
        _client = client;
        _logger = logger;
        _mapper = mapper;
    }

    public async Task<ApiResult<List<ClientDto>>> GetClients()
    {
        var clients = _mapper.Map(await _client.GetClients(), new List<ClientDto>());

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
            _logger.Error($"Could not kick user {id}", ex);
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
            _logger.Error($"Could not ban user {id}", ex);
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
            _logger.Error($"Could not poke user {id}", ex);
            return ApiResult.Build(false, false, ReasonCodes.InvalidArgument, nameof(id));
        }
    }
}
