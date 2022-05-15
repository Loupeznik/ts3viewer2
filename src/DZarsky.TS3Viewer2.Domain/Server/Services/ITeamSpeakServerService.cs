using DZarsky.TS3Viewer2.Domain.Server.Dto;
using TeamSpeak3QueryApi.Net.Specialized.Responses;

namespace DZarsky.TS3Viewer2.Domain.Server.Services;

public interface ITeamSpeakServerService
{
    public Task<bool> SendGlobalMessage(MessageDto message);

    public Task<ServerInfoDto?> GetServerInfo();
}
