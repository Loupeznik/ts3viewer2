namespace DZarsky.TS3Viewer2.Domain.Infrastructure.General;

public sealed class TokenResult
{
    public string Token { get; set; }

    public TokenResult(string token) => Token = token;
}
