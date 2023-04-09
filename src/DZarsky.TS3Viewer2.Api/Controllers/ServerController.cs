using DZarsky.TS3Viewer2.Api.Common;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DZarsky.TS3Viewer2.Api.Controllers;

[Route($"{BaseUrl}/server")]
public class ServerController : ApiControllerBase
{
    private readonly ITeamSpeakServerService _serverService;

    public ServerController(ITeamSpeakServerService serverService) => _serverService = serverService;

    /// <summary>
    /// Sends global message
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [HttpPost("messages/global")]
    [Authorize(Policy = EndpointPolicyConstants.UserAuthorizationPolicy)]
    [Authorize(Policy = EndpointPolicyConstants.ServerAdminPolicy)]
    public async Task<ActionResult> SendGlobalMessage(MessageDto message) =>
        ApiResultToActionResult(await _serverService.SendGlobalMessage(message));

    /// <summary>
    /// Sends global message
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [HttpGet("info")]
    public async Task<ActionResult<ServerInfoDto>> GetServerInfo() =>
        ApiResultToActionResult(await _serverService.GetServerInfo());

    /// <summary>
    /// Sends global message
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [HttpGet("groups")]
    [Authorize(Policy = EndpointPolicyConstants.UserAuthorizationPolicy)]
    public async Task<ActionResult<List<ServerGroupDto>>> GetServerGroups() =>
        ApiResultToActionResult(await _serverService.GetServerGroups());
}
