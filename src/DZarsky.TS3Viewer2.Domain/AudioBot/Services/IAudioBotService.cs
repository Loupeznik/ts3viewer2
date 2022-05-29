using DZarsky.TS3Viewer2.Domain.AudioBot.Dto;

namespace DZarsky.TS3Viewer2.Domain.AudioBot.Services;

public interface IAudioBotService
{
    public Task<VolumeDto> GetCurrentVolume();

    public Task<VolumeDto> SetVolume(VolumeDto volume);

    public Task<SongDto> GetCurrentSong();

    public Task<SongDto> PlaySong(SongDto song);

    public Task<SongDto> StopPlayback();

    public Task<SongDto> PausePlayback();

    public Task<bool> MoveBotToChannel(MoveBotDto channel);
}
