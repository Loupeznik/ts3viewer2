using DZarsky.TS3Viewer2.Api.Infrastructure.Security.Configuration;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
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

    public string GenerateToken() => new JwtSecurityTokenHandler()
            .WriteToken(new JwtSecurityToken(_config.Issuer,
                _config.Audience.FirstOrDefault(),
                claims: new List<Claim>
                {
                    new Claim(ClaimTypes.Name, "test"),
                    new Claim(ClaimTypes.Role, ApiRole.App)
                },
                expires: DateTime.Now.AddHours(12),
                signingCredentials: new SigningCredentials(new JsonWebKey(Encoding.ASCII.GetString(Convert.FromBase64String(_config.Key!))), SecurityAlgorithms.RsaSha256)));
}
