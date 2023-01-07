namespace DZarsky.TS3Viewer2.Domain.Infrastructure.General;

public sealed class TokenResult
{
    /// <summary>
    /// Gets or sets the JWT
    /// </summary>
    public string Token { get; set; }

    /// <summary>
    /// Gets or sets the token expiration time in hours
    /// </summary>
    public int ExpiresIn { get; set; }

    public TokenResult(string token, int expiresIn)
    {
        Token = token;
        ExpiresIn = expiresIn;
    }
}
