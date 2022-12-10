using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace DZarsky.TS3Viewer2.Api.Controllers;

[Route($"{BaseUrl}/server/channels")]
public class ChannelController : ApiControllerBase
{
    private readonly ITeamSpeakChannelService _channelService;

    public ChannelController(ITeamSpeakChannelService channelService) => _channelService = channelService;

    /// <summary>
    /// Gets all channels
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet]
    public async Task<ActionResult<IList<ChannelDto>>> GetChannels()
        => new JsonResult(await _channelService.GetChannels());

    /// <summary>
    /// Sends message to channel by current ID
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [HttpPost("{id:int}/message")]
    public async Task<ActionResult> SendMessage(int id, [FromBody] MessageDto message) =>
        BoolToActionResult((await _channelService.SendMessage(id, message)).Result);
}
