using DZarsky.TS3Viewer2.Core.Server.Services;
using DZarsky.TS3Viewer2.Domain.Server.Models;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using TeamSpeak3QueryApi.Net.Specialized;

namespace DZarsky.TS3Viewer2.Core.Infrastructure.Extensions;

public static class TeamSpeakApiConfigExtensions
{
    public static IServiceCollection AddTeamSpeakApi(this IServiceCollection services, IConfiguration config)
    {
        var serverConfig = config.GetSection("TeamSpeakServer").Get<ServerInstance>();

        if (serverConfig == null)
        {
            throw new SystemException("Cannot find TeamSpeakServer config.");
        }

        services.AddSingleton(serverConfig);

        var teamspeakClient = ConfigureClient(serverConfig).Result;

        services.AddTeamSpeakServices();
        services.AddSingleton(teamspeakClient);

        return services;
    }

    private static async Task<TeamSpeakClient> ConfigureClient(ServerInstance serverConfig)
    {
        var client = new TeamSpeakClient(serverConfig.Host, serverConfig.Port, TimeSpan.Zero);

        await client.Connect();
        await client.Login(serverConfig.Login, serverConfig.Token);
        await client.UseServer(serverConfig.ServerId);

        return client;
    }

    private static void AddTeamSpeakServices(this IServiceCollection services)
    {
        services.AddScoped<ITeamSpeakClientService, TeamSpeakClientService>();
        services.AddScoped<ITeamSpeakServerService, TeamSpeakServerService>();
        services.AddScoped<ITeamSpeakChannelService, TeamSpeakChannelService>();
    }
}
