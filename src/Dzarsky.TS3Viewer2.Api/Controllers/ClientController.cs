using DZarsky.TS3Viewer2.Domain.Server.Dto;
using DZarsky.TS3Viewer2.Domain.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DZarsky.TS3Viewer2.Api.Controllers;

[Route($"{BaseUrl}/server/clients")]
[Authorize(Policy = UserAuthorizationPolicy)]
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
    [Authorize(Policy = AppAuthorizationPolicy)]
    public async Task<ActionResult<List<ClientDto>>> GetClients([FromQuery] bool? getDetail) => ApiResultToActionResult(await _clientService.GetClients(getDetail));

    /// <summary>
    /// Kicks client by current ID
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [HttpGet("{id:int}/kick")]
    public async Task<ActionResult<bool>> KickClient(int id) =>
        ApiResultToActionResult((await _clientService.KickClient(id)));

    /// <summary>
    /// Bans client by current ID
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [HttpPost("{id:int}/ban")]
    public async Task<ActionResult<bool>> BanClient(int id, [FromBody] BanClientDto banInfo) =>
        ApiResultToActionResult((await _clientService.BanClient(id, banInfo)));

    /// <summary>
    /// Pokes client by current ID
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
    [HttpPost("{id:int}/poke")]
    public async Task<ActionResult<bool>> PokeClient(int id, [FromBody] MessageDto pokeInfo) =>
        ApiResultToActionResult((await _clientService.PokeClient(id, pokeInfo)));
}
