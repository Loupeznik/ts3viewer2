using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace DZarsky.TS3Viewer2.Api.Controllers;

[Route($"{BaseUrl}/server/clients")]
public class ClientController : ApiControllerBase
{
    private readonly ITeamSpeakClientService _teamspeakClientService;

    public ClientController(ITeamSpeakClientService serverService) => _teamspeakClientService = serverService;
    
    /// <summary>
    /// Gets clients
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet()]
    public async Task<ActionResult<IList<ClientDto>>> GetClients()
    {
        var clients = await _teamspeakClientService.GetClients();

        return new JsonResult(clients);
    }

    /// <summary>
    /// Kicks client by current ID
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet("kick/{id:int}")]
    public async Task<ActionResult> KickClient(int id)
    {
        var kickResult = await _teamspeakClientService.KickClient(id);

        if (kickResult)
        {
            return Ok();
        }
        
        return BadRequest();
    }
    
    /// <summary>
    /// Bans client by current ID
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [HttpPost("ban/{id:int}")]
    public async Task<ActionResult> BanClient(int id, [FromBody] BanClientDto banInfo)
    {
        var banResult = await _teamspeakClientService.BanClient(id, banInfo);

        if (banResult)
        {
            return Ok();
        }
        
        return BadRequest();
    }
}
