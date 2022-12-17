using System.Globalization;
using DZarsky.TS3Viewer2.Core.AudioBot.Models;
using DZarsky.TS3Viewer2.Core.Infrastructure.Net;
using DZarsky.TS3Viewer2.Core.TS3AudioBot;
using DZarsky.TS3Viewer2.Domain.AudioBot.Constants;
using DZarsky.TS3Viewer2.Domain.AudioBot.Dto;
using DZarsky.TS3Viewer2.Domain.AudioBot.Models;
using DZarsky.TS3Viewer2.Domain.AudioBot.Services;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using Newtonsoft.Json;
using Serilog;

namespace DZarsky.TS3Viewer2.Core.AudioBot.Services;

public sealed class AudioBotService : IAudioBotService
{
    private readonly AudioBotApiClientFactory _clientFactory;
    private readonly ILogger _logger;

    public AudioBotService(AudioBotApiClientFactory apiClientFactory, ILogger logger)
    {
        _clientFactory = apiClientFactory;
        _logger = logger;
    }

    public async Task<ApiResult<SongDto>> GetCurrentSong()
    {
        try
        {
            var result = await GetSong(_clientFactory.GetApiClient());

            return ApiResult.Build(MapSongToDto(result));
        }
        catch (ApiException ex)
        {
            if (!IsGetSongSuccess(ex.StatusCode))
            {
                ConstructAndLogErrorMessage(nameof(GetCurrentSong), ex);
                return ApiResult.Build(new SongDto(), false, ReasonCodes.ExternalServerError, ex.Message);
            }

            return ApiResult.Build(new SongDto());
        }
    }

    public async Task<ApiResult<VolumeDto>> GetCurrentVolume()
    {
        var volume = new VolumeDto();

        var client = _clientFactory.GetHttpClient();
        var response = await client.GetAsync(string.Concat(client.BaseAddress, "volume"));

        if (response.IsSuccessStatusCode)
        {
            volume.Volume = JsonConvert.DeserializeObject<BaseValueResponse<float>>(await response.Content.ReadAsStringAsync())?.Value ?? 0;
        }

        return ApiResult.Build(volume);
    }

    public async Task<ApiResult<bool>> MoveBotToChannel(MoveBotDto channel)
    {
        try
        {
            _ = await _clientFactory.GetApiClient().BotMoveAsync(channel.ChannelId, channel.Password);

            return ApiResult.Build(true);
        }
        catch (Exception ex)
        {
            ConstructAndLogErrorMessage(nameof(MoveBotToChannel), ex);
            return ApiResult.Build(false, false, ReasonCodes.ExternalServerError, ex.Message);
        }
    }

    public async Task<ApiResult<SongDto>> PausePlayback()
    {
        var client = _clientFactory.GetApiClient();

        try
        {
            await client.PauseAsync();

            return ApiResult.Build(MapSongToDto(await GetSong(client)));
        }
        catch (ApiException ex)
        {
            if (!IsGetSongSuccess(ex.StatusCode))
            {
                ConstructAndLogErrorMessage(nameof(PausePlayback), ex);
                return ApiResult.Build(new SongDto(), false, ReasonCodes.ExternalServerError, ex.Message);
            }
        }

        return ApiResult.Build(new SongDto());
    }

    public async Task<ApiResult<SongDto>> PlaySong(SongDto song)
    {
        var client = _clientFactory.GetApiClient();

        try
        {
            var result = await client.Play___GetAsync(song.Link, new List<string>());

            var resultObject = result != null
                ? JsonConvert.DeserializeObject<AudioBotCommandResult>(Convert.ToString(result)!)
                : null;

            if (resultObject?.ErrorCode == 10)
            {
                return ApiResult.Build(new SongDto(), false, ReasonCodes.NotFound);
            }
        }
        catch (ApiException ex)
        {
            if (!IsGetSongSuccess(ex.StatusCode))
            {
                ConstructAndLogErrorMessage(nameof(PlaySong), ex);
                return ApiResult.Build(new SongDto(), false, ReasonCodes.ExternalServerError, ex.Message);
            }

            return ApiResult.Build(MapSongToDto(await GetSong(client)));
        }

        return ApiResult.Build(new SongDto());
    }

    public async Task<ApiResult<VolumeDto>> SetVolume(VolumeDto volume)
    {
        try
        {
            await _clientFactory.GetApiClient().VolumeGetAsync(volume.Volume.ToString(CultureInfo.InvariantCulture));
        }
        catch (Exception ex)
        {
            ConstructAndLogErrorMessage(nameof(SetVolume), ex);
            volume.Volume = 0;
        }

        return ApiResult.Build(volume);
    }

    public async Task<ApiResult<SongDto>> StopPlayback()
    {
        try
        {
            await _clientFactory.GetApiClient().StopAsync();
        }
        catch (ApiException ex)
        {
            if (IsGetSongSuccess(ex.StatusCode))
            {
                ConstructAndLogErrorMessage(nameof(StopPlayback), ex);
                return ApiResult.Build(new SongDto(), false, ReasonCodes.ExternalServerError, ex.Message);

            }
        }

        return ApiResult.Build(new SongDto());
    }

    private void ConstructAndLogErrorMessage(string action, Exception ex)
    {
        _logger.Error($"Could not invoke {action}: {ex}", ex);
    }

    private static async Task<object> GetSong(Client client) => await client.SongAsync();

    private static SongDto MapSongToDto(object song)
    {
        var stringResult = Convert.ToString(song);

        return string.IsNullOrWhiteSpace(stringResult) ? new SongDto() : JsonConvert.DeserializeObject<SongDto>(stringResult)!;
    }

    private static bool IsGetSongSuccess(int statusCode) =>
        AudioBotConstants.GetSongSuccessStatusCodes.Contains(statusCode);
}
