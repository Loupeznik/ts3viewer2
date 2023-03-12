using DZarsky.TS3Viewer2.Domain.Users.Models;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;

namespace DZarsky.TS3Viewer2.Api.Infrastructure.Security;

internal static class PolicyConfigExtensions
{
    public static void RegisterPolicies(this AuthorizationOptions options)
    {
        options.AddPolicy(nameof(UserType.App), policy => policy.RequireClaim(ClaimTypes.Role, nameof(UserType.App), nameof(UserType.User)));
        options.AddPolicy(nameof(UserType.User), policy => policy.RequireClaim(ClaimTypes.Role, nameof(UserType.User)));
        options.RegisterRolePolicies(Enum.GetNames<Permission>());
    }

    public static void RegisterRolePolicies(this AuthorizationOptions options, params string[] permissions)
    {
        foreach (var permission in permissions)
        {
            var allowedValues = new[] { permission };

            var lowerAdmins = new List<string>
            {
                nameof(Permission.AudioBotAdmin),
                nameof(Permission.ChannelAdmin),
                nameof(Permission.ClientAdmin)
            };

            if (lowerAdmins.Contains(permission))
            {
                allowedValues = allowedValues.Append(nameof(Permission.ServerAdmin)).ToArray();
            }

            if (permission != nameof(Permission.SuperAdmin))
            {
                allowedValues = allowedValues.Append(nameof(Permission.SuperAdmin)).ToArray();
            }

            options.AddPolicy(permission, policy => policy.RequireClaim(CustomClaims.Permissions, allowedValues));
        }
    }
}
