namespace DZarsky.TS3Viewer2.Api.Infrastructure.Security.Configuration;

public sealed class JwtConfig
{
    public string? Issuer { get; set; }

    public IList<string> Audience { get; set; } = new List<string>();

    public string? Key { get; set; }
}
