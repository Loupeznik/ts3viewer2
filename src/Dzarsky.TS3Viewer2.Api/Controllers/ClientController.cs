using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Microsoft.AspNetCore.Mvc;

namespace DZarsky.TS3Viewer2.Api.Controllers;

[Route($"{BaseUrl}/server/clients")]
public class ClientController : ApiControllerBase
{
    private readonly ITeamSpeakClientService _clientService;

    public ClientController(ITeamSpeakClientService clientService) => _clientService = clientService;

    /// <summary>
    /// Gets clients
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet]
    public async Task<ActionResult<IList<ClientDto>>> GetClients() => Ok(await _clientService.GetClients());

    /// <summary>
    /// Kicks client by current ID
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet("{id:int}/kick")]
    public async Task<ActionResult> KickClient(int id) =>
        BoolToActionResult((await _clientService.KickClient(id)).Result);

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
        BoolToActionResult((await _clientService.BanClient(id, banInfo)).Result);

    /// <summary>
    /// Pokes client by current ID
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [HttpPost("{id:int}/poke")]
    public async Task<ActionResult> PokeClient(int id, [FromBody] MessageDto pokeInfo) =>
        BoolToActionResult((await _clientService.PokeClient(id, pokeInfo)).Result);
}
