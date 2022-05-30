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
            var baseUrl = $"{_config.BaseUrl}/bot/use/{_config.BotID}/(/";

            _httpClient.BaseAddress = new Uri(baseUrl);

            return new Client(_httpClient);
        }
    }
}
