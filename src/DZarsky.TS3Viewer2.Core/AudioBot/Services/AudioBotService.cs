using DZarsky.TS3Viewer2.Core.AudioBot.Models;
using DZarsky.TS3Viewer2.Core.Infrastructure.Net;
using DZarsky.TS3Viewer2.Core.TS3AudioBot;
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
        try
        {
            var result = await GetSong(_clientFactory.GetApiClient());
            return MapSongToDto(result);
        }
        catch (Exception ex)
        {
            ConstructAndLogErrorMessage(nameof(GetCurrentSong), ex);
        }

        return new SongDto();
    }

    public async Task<VolumeDto> GetCurrentVolume()
    {
        var volume = new VolumeDto();

        var client = _clientFactory.GetHttpClient();
        var response = await client.GetAsync(string.Concat(client.BaseAddress, "volume"));

        if (response.IsSuccessStatusCode)
        {
            volume.Volume = JsonConvert.DeserializeObject<BaseValueResponse<float>>(await response.Content.ReadAsStringAsync())?.Value ?? 0;
        }

        return volume;
    }

    public async Task<bool> MoveBotToChannel(MoveBotDto channel)
    {
        try
        {
            _ = await _clientFactory.GetApiClient().BotMoveAsync(channel.ChannelId, channel.Password);

            return true;
        }
        catch (Exception ex)
        {
            ConstructAndLogErrorMessage(nameof(MoveBotToChannel), ex);
            return false;
        }
    }

    public async Task<SongDto> PausePlayback()
    {
        var client = _clientFactory.GetApiClient();

        try
        {
            await client.PauseAsync();
        }
        catch (Exception ex)
        {
            ConstructAndLogErrorMessage(nameof(PausePlayback), ex);
        }

        return MapSongToDto(await GetSong(client));
    }

    public async Task<SongDto> PlaySong(SongDto song)
    {
        var client = _clientFactory.GetApiClient();

        try
        {
            _ = await client.Play___GetAsync(song.Link, new List<string>());
        }
        catch (Exception ex)
        {
            ConstructAndLogErrorMessage(nameof(PlaySong), ex);
        }

        return MapSongToDto(await GetSong(client));
    }

    public async Task<VolumeDto> SetVolume(VolumeDto volume)
    {
        try
        {
            await _clientFactory.GetApiClient().VolumeGetAsync(volume.Volume.ToString());
        }
        catch (Exception ex)
        {
            ConstructAndLogErrorMessage(nameof(SetVolume), ex);
            volume.Volume = 0;
        }

        return volume;
    }

    public async Task<SongDto> StopPlayback()
    {
        try
        {
            await _clientFactory.GetApiClient().StopAsync();
        }
        catch (Exception ex)
        {
            ConstructAndLogErrorMessage(nameof(StopPlayback), ex);
        }

        return new SongDto();
    }

    private void ConstructAndLogErrorMessage(string action, Exception ex)
    {
        _logger.Error($"Could not invoke {action}", ex);
    }

    private static async Task<object> GetSong(Client client) => await client.SongAsync();

    private static SongDto MapSongToDto(object song)
    {
        var stringResult = Convert.ToString(song);

        if (string.IsNullOrWhiteSpace(stringResult))
        {
            return new SongDto();
        }

        return JsonConvert.DeserializeObject<SongDto>(stringResult)!;
    }
}
