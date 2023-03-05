using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Users.Models;

namespace DZarsky.TS3Viewer2.Api.Common;

internal static class EndpointPolicyConstants
{
    internal const string AppAuthorizationPolicy = nameof(ApiRole.App);
    internal const string UserAuthorizationPolicy = nameof(ApiRole.User);

    internal const string SuperAdminPolicy = nameof(Permission.SuperAdmin);
    internal const string AudioBotAdminPolicy = nameof(Permission.AudioBotAdmin);
    internal const string ServerAdminPolicy = nameof(Permission.ServerAdmin);
    internal const string ChannelAdminPolicy = nameof(Permission.ChannelAdmin);
    internal const string ClientAdminPolicy = nameof(Permission.ClientAdmin);
    internal const string ApiUserAdminPolicy = nameof(Permission.ApiUserAdmin);
}
