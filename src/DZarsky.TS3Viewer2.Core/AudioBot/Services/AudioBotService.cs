using DZarsky.TS3Viewer2.Core.Infrastructure.Net;
using DZarsky.TS3Viewer2.Domain.AudioBot.Dto;
using DZarsky.TS3Viewer2.Domain.AudioBot.Services;
using Newtonsoft.Json;
using Serilog;

namespace DZarsky.TS3Viewer2.Core.AudioBot.Services;

public class AudioBotService : IAudioBotService
{
    private readonly AudioBotApiClientFactory _clientFactory;
    private readonly ILogger _logger;

    public AudioBotService(AudioBotApiClientFactory apiClientFactory, ILogger logger)
    {
        _clientFactory = apiClientFactory;
        _logger = logger;
    } 

    public async Task<SongDto> GetCurrentSong()
    {
        var song = new SongDto();

        try
        {
            var client = _clientFactory.GetApiClient();
            var result = await client.SongAsync();
            var stringResult = Convert.ToString(result);

            if (result == null || string.IsNullOrWhiteSpace(stringResult))
            {
                return song;
            }

            song = JsonConvert.DeserializeObject<SongDto>(stringResult);
        }
        catch (Exception ex)
        {
            _logger.Error("Could not get current song", ex);
        }

        return song!;
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
