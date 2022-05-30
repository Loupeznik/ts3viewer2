using DZarsky.TS3Viewer2.Core.AudioBot.Services;
using DZarsky.TS3Viewer2.Core.Infrastructure.Net;
using DZarsky.TS3Viewer2.Domain.AudioBot.Configuration;
using DZarsky.TS3Viewer2.Domain.AudioBot.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DZarsky.TS3Viewer2.Core.Infrastructure.Extensions
{
    public static class AudioBotConfigExtensions
    {
        public static IServiceCollection AddAudioBot(this IServiceCollection services, IConfiguration config)
        {
            var audioBotConfig = config.GetSection("AudioBot").Get<AudioBotConfig>();

            services.AddSingleton(audioBotConfig);

            services.AddScoped<AudioBotApiClientFactory>();
            services.AddScoped<IAudioBotService, AudioBotService>();

            return services;
        }
    }
}
