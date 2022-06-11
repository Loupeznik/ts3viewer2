using DZarsky.TS3Viewer2.Core.TS3AudioBot;
using DZarsky.TS3Viewer2.Domain.AudioBot.Configuration;

namespace DZarsky.TS3Viewer2.Core.Infrastructure.Net
{
    public class AudioBotApiClientFactory
    {
        private readonly AudioBotConfig _config;
        private readonly HttpClient _httpClient = new();

        public AudioBotApiClientFactory(AudioBotConfig config) => _config = config;

        public Client GetApiClient()
        {
            var baseUrl = ConstructBaseUrl();

            _httpClient.BaseAddress = new Uri(baseUrl);

            return new Client(_httpClient)
            {
                BaseUrl = baseUrl
            };
        }

        public HttpClient GetHttpClient()
        {
            _httpClient.BaseAddress = new Uri(ConstructBaseUrl());

            return _httpClient;
        }

        private string ConstructBaseUrl() => $"{_config.BaseUrl}/bot/use/{_config.BotID}/(/";
    }
}
