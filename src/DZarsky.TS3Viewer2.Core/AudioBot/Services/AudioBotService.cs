using DZarsky.TS3Viewer2.Domain.AudioBot.Dto;
using DZarsky.TS3Viewer2.Domain.AudioBot.Services;

namespace DZarsky.TS3Viewer2.Core.AudioBot.Services;

public class AudioBotService : IAudioBotService
{
    public Task<SongDto> GetCurrentSong()
    {
        throw new NotImplementedException();
    }

    public Task<VolumeDto> GetCurrentVolume()
    {
        throw new NotImplementedException();
    }

    public Task<bool> MoveBotToChannel(MoveBotDto channel)
    {
        throw new NotImplementedException();
    }

    public Task<SongDto> PausePlayback()
    {
        throw new NotImplementedException();
    }

    public Task<SongDto> PlaySong(SongDto song)
    {
        throw new NotImplementedException();
    }

    public Task<VolumeDto> SetVolume(VolumeDto volume)
    {
        throw new NotImplementedException();
    }

    public Task<SongDto> StopPlayback()
    {
        throw new NotImplementedException();
    }
}
