using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Server.Dto;

namespace DZarsky.TS3Viewer2.Domain.Server.Services;

public interface ITeamSpeakClientService
{
    public Task<ApiResult<List<ClientDto>>> GetClients(bool? getDetails = false);

    public Task<ApiResult> KickClient(int id);

    public Task<ApiResult> BanClient(int id, BanClientDto banInfo);

    public Task<ApiResult> PokeClient(int id, MessageDto pokeInfo);

    /// <summary>
    /// Checks if the client is in the Server Admin group
    /// </summary>
    /// <param name="clientDatabaseId">The TeamSpeak server database ID</param>
    /// <returns></returns>
    public Task<bool> IsClientAdmin(int clientDatabaseId);

    /// <summary>
    /// Gets Database UserID from the TeamSpeak server database by unique ClientID
    /// </summary>
    /// <param name="teamspeakId">The unique TeamSpeak client ID</param>
    /// <returns>The TeamSpeak server database ID</returns>
    public Task<int> GetUserFromDatabase(string teamspeakId);
}
