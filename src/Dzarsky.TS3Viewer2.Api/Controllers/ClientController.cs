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
    [HttpGet]
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
    [HttpGet("{id:int}/kick")]
    public async Task<ActionResult> KickClient(int id) =>
        BoolToActionResult(await _teamspeakClientService.KickClient(id));

    /// <summary>
    /// Bans client by current ID
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [HttpPost("{id:int}/ban")]
    public async Task<ActionResult> BanClient(int id, [FromBody] BanClientDto banInfo) =>
        BoolToActionResult(await _teamspeakClientService.BanClient(id, banInfo));

    /// <summary>
    /// Pokes client by current ID
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [HttpPost("{id:int}/poke")]
    public async Task<ActionResult> PokeClient(int id, [FromBody] PokeClientDto pokeInfo) =>
        BoolToActionResult(await _teamspeakClientService.PokeClient(id, pokeInfo));
}
