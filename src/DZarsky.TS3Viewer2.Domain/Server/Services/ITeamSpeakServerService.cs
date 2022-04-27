using DZarsky.TS3Viewer2.Domain.Server.Dto;

namespace DZarsky.TS3Viewer2.Domain.Server.Services;

public interface ITeamSpeakServerService
{
    public Task<bool> SendGlobalMessage(MessageDto message);
}
