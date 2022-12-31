using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;

namespace DZarsky.TS3Viewer2.Data.Infrastructure.Extensions;

public static class DALExtensions
{
    public static string GetConnectionString(this IConfiguration config)
    {
        var connectionString = config.GetConnectionString("db");

        if (string.IsNullOrWhiteSpace(connectionString))
        {
            throw new NullReferenceException("Connection string cannot be empty");
        }

        return connectionString;
    }

    public static IServiceCollection AddData(this IServiceCollection services, IConfiguration config)
    {
        services.AddDbContext<DataContext>(options => options.UseSqlite(config.GetConnectionString()));

        return services;
    }
}
