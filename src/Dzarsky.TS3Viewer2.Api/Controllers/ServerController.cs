using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
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
    public async Task<ActionResult> SendGlobalMessage(MessageDto message) =>
        BoolToActionResult((await _serverService.SendGlobalMessage(message)).Result);

    /// <summary>
    /// Sends global message
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [HttpGet("info")]
    public async Task<ActionResult<ServerInfoDto>> GetServerInfo()
    {
        var result = await _serverService.GetServerInfo();

        if (!result.IsSuccess)
        {
            return BadRequest();
        }

        return Ok(result);
    }
}
