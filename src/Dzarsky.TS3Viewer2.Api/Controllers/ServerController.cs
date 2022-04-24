using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace DZarsky.TS3Viewer2.Api.Controllers;

[Route($"{BaseUrl}/server")]
public class ServerController : ApiControllerBase
{
    private readonly ITeamSpeakServerService _teamspeakServerService;

    public ServerController(ITeamSpeakServerService serverService) => _teamspeakServerService = serverService;
    
    /// <summary>
    /// Gets clients
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet("clients")]
    public async Task<ActionResult<IList<ClientDto>>> GetClients()
    {
        var clients = await _teamspeakServerService.GetClients();

        return new JsonResult(clients);
    }
    
    /// <summary>
    /// Kicks client by current ID
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet("clients/kick/{id:int}")]
    public async Task<ActionResult> KickClient(int id)
    {
        var kickResult = await _teamspeakServerService.KickClient(id);

        if (kickResult)
        {
            return Ok();
        }
        
        return BadRequest();
    }
}
