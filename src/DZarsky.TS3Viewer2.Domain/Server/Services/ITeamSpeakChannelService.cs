using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Server.Dto;

namespace DZarsky.TS3Viewer2.Domain.Server.Services;

public interface ITeamSpeakChannelService
{
    public Task<ApiResult<bool>> SendMessage(int id, MessageDto message);

    public Task<ApiResult<List<ChannelDto>>> GetChannels();
}
