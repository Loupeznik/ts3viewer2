using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Server.Dto;

namespace DZarsky.TS3Viewer2.Domain.Server.Services;

public interface ITeamSpeakClientService
{
    public Task<ApiResult<List<ClientDto>>> GetClients();

    public Task<ApiResult<bool>> KickClient(int id);

    public Task<ApiResult<bool>> BanClient(int id, BanClientDto banInfo);

    public Task<ApiResult<bool>> PokeClient(int id, MessageDto pokeInfo);
}
