using DZarsky.TS3Viewer2.Domain.AudioBot.Dto;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;

namespace DZarsky.TS3Viewer2.Domain.AudioBot.Services;

public interface IAudioBotService
{
    public Task<ApiResult<VolumeDto>> GetCurrentVolume();

    public Task<ApiResult<VolumeDto>> SetVolume(VolumeDto volume);

    public Task<ApiResult<SongDto>> GetCurrentSong();

    public Task<ApiResult<SongDto>> PlaySong(SongDto song);

    public Task<ApiResult<SongDto>> StopPlayback();

    public Task<ApiResult<SongDto>> PausePlayback();

    public Task<ApiResult<bool>> MoveBotToChannel(MoveBotDto channel);
}
