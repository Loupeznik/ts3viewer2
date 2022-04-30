using DZarsky.TS3Viewer2.Domain.Server.Dto;

namespace DZarsky.TS3Viewer2.Domain.Server.Services;

public interface ITeamSpeakChannelService
{
    public Task<bool> SendMessage(int id, MessageDto message);

    public Task<IList<ChannelDto>> GetChannels();
}
