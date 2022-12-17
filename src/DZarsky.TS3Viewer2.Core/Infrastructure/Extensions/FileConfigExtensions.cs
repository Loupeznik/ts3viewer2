using DZarsky.TS3Viewer2.Core.Files.Services;
using DZarsky.TS3Viewer2.Domain.Files.Configuration;
using DZarsky.TS3Viewer2.Domain.Files.Services;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DZarsky.TS3Viewer2.Core.Infrastructure.Extensions;

public static class FileConfigExtensions
{
    public static IServiceCollection AddFiles(this IServiceCollection services, IConfiguration config)
    {
        var fileConfig = config.GetSection("Files").Get<FileConfig>();

        if (fileConfig == null)
        {
            throw new SystemException("Cannot find Files config.");
        }

        services.AddSingleton(fileConfig);
        services.AddScoped<IFileService, FileService>();

        return services;
    }
}
