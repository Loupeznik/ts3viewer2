using DZarsky.TS3Viewer2.Domain.Server.Dto;

namespace DZarsky.TS3Viewer2.Domain.Server.Services;

public interface ITeamSpeakClientService
{
    public Task<IList<ClientDto>> GetClients();
    
    public Task<bool> KickClient(int id);

    public Task<bool> BanClient(int id, BanClientDto banInfo);
    
    public Task<bool> PokeClient(int id, PokeClientDto pokeInfo);
}
