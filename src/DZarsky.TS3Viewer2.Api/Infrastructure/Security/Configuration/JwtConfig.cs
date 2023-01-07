namespace DZarsky.TS3Viewer2.Api.Infrastructure.Security.Configuration;

public sealed class JwtConfig
{
    public string? Issuer { get; set; }

    public IList<string> Audience { get; set; } = new List<string>();

    public string? Key { get; set; }

    /// <summary>
    /// Gets or sets the token expiration time in hours
    /// </summary>
    public int Expiration { get; set; }
}
