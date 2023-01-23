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
    [Authorize(Policy = UserAuthorizationPolicy)]
    public async Task<ActionResult<bool>> SendGlobalMessage(MessageDto message) =>
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
}
