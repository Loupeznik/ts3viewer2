using DZarsky.TS3Viewer2.Api.Infrastructure.Security.Configuration;
using Microsoft.IdentityModel.Tokens;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace DZarsky.TS3Viewer2.Api.Infrastructure.Security;

public sealed class TokenProvider
{
    private readonly JwtConfig _config;

    public TokenProvider(JwtConfig config)
    {
        _config = config;
    }

    public (string, int) GenerateToken(string userId, string role, string[] permissions)
    {
        var claims = new List<Claim>
        {
            new(CustomClaims.Sub, userId),
            new(CustomClaims.Role, role),
        };

        claims.AddRange(permissions.Select(permission => new Claim(CustomClaims.Permissions, permission)));

        return (new JwtSecurityTokenHandler()
                .WriteToken(new JwtSecurityToken(_config.Issuer,
                    _config.Audience.FirstOrDefault(),
                    claims: claims,
                    expires: DateTime.Now.AddHours(_config.Expiration),
                    signingCredentials: new SigningCredentials(
                        new JsonWebKey(Encoding.ASCII.GetString(Convert.FromBase64String(_config.Key!))),
                        SecurityAlgorithms.RsaSha256))),
            _config.Expiration);
    }
}
