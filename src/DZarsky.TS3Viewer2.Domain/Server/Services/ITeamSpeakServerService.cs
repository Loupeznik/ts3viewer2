using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Server.Dto;

namespace DZarsky.TS3Viewer2.Domain.Server.Services;

public interface ITeamSpeakServerService
{
    public Task<ApiResult> SendGlobalMessage(MessageDto message);

    public Task<ApiResult<ServerInfoDto>> GetServerInfo();

    public Task<ApiResult<List<ServerGroupDto>>> GetServerGroups();
}
