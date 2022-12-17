using DZarsky.TS3Viewer2.Core.TS3AudioBot;
using DZarsky.TS3Viewer2.Domain.AudioBot.Configuration;
using System.Net.Http.Headers;
using System.Text;

namespace DZarsky.TS3Viewer2.Core.Infrastructure.Net;

public sealed class AudioBotApiClientFactory
{
    private readonly AudioBotConfig _config;
    private readonly HttpClient _httpClient = new();

    public AudioBotApiClientFactory(AudioBotConfig config) => _config = config;

    public Client GetApiClient()
    {
        var baseUrl = ConstructBaseUrl();

        _httpClient.BaseAddress = new Uri(baseUrl);
        SetAuthorizationHeader();

        return new Client(_httpClient)
        {
            BaseUrl = baseUrl
        };
    }

    public HttpClient GetHttpClient()
    {
        _httpClient.BaseAddress = new Uri(ConstructBaseUrl());
        SetAuthorizationHeader();

        return _httpClient;
    }

    private string ConstructBaseUrl() => $"{_config.BaseUrl}/bot/use/{_config.BotID}/(/";

    private void SetAuthorizationHeader()
    {
        if (string.IsNullOrWhiteSpace(_config.Token))
        {
            return;
        }

        _httpClient.DefaultRequestHeaders.Authorization = new AuthenticationHeaderValue("Basic", Convert.ToBase64String(Encoding.UTF8.GetBytes(_config.Token)));
    }
}
