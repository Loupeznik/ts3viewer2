using DZarsky.TS3Viewer2.Api.Infrastructure.Security;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Users.Dto;
using DZarsky.TS3Viewer2.Domain.Users.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using System.Security.Claims;
using DZarsky.TS3Viewer2.Api.Common;
using DZarsky.TS3Viewer2.Domain.Users.General;

namespace DZarsky.TS3Viewer2.Api.Controllers;

[Route($"{BaseUrl}/users")]
public sealed class UserController : ApiControllerBase
{
    private readonly IUserService _userService;
    private readonly TokenProvider _tokenProvider;

    public UserController(IUserService userService, TokenProvider tokenProvider)
    {
        _userService = userService;
        _tokenProvider = tokenProvider;
    }

    /// <summary>
    /// Create a user
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [HttpPost]
    [Authorize(Policy = EndpointPolicyConstants.AppAuthorizationPolicy)]
    public async Task<ActionResult> AddUser([FromBody] UserDto user)
    {
        var claimsIdentity = User.Identity as ClaimsIdentity;
        var result = await _userService.AddUser(user, claimsIdentity?
            .FindFirst(x => x.Type == claimsIdentity.RoleClaimType)?.Value);

        if (result != AddUserResult.Success)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Failed to create user",
                Detail = result.ToString()
            });
        }

        return Ok();
    }

    /// <summary>
    /// Gets all users
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [HttpGet]
    [Authorize(Policy = EndpointPolicyConstants.UserAuthorizationPolicy)]
    [Authorize(Policy = EndpointPolicyConstants.ApiUserAdminPolicy)]
    public async Task<ActionResult<List<UserInfoDto>>> GetUsers([FromQuery] bool? onlyActive = true) =>
        ApiResultToActionResult(await _userService.GetUsers(onlyActive.GetValueOrDefault()));

    /// <summary>
    /// Update a user
    /// </summary>
    /// <param name="userId">The ID of the user to update</param>
    /// <param name="user">The user model</param>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [HttpPut("{userId:int}")]
    [Authorize(Policy = EndpointPolicyConstants.UserAuthorizationPolicy)]
    [Authorize(Policy = EndpointPolicyConstants.ApiUserAdminPolicy)]
    public async Task<ActionResult<UserInfoDto>> UpdateUser(int userId, [FromBody] UserInfoDto user) =>
        ApiResultToActionResult(await _userService.UpdateUser(user));

    /// <summary>
    /// Delete a user
    /// </summary>
    /// <param name="userId">The ID of the user to delete</param>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [HttpDelete("{userId:int}")]
    [Authorize(Policy = EndpointPolicyConstants.UserAuthorizationPolicy)]
    [Authorize(Policy = EndpointPolicyConstants.ApiUserAdminPolicy)]
    public async Task<ActionResult> DeleteUser(int userId)
    {
        var result = await _userService.DeleteUser(userId);

        return result switch
        {
            DeleteUserResult.Success => Ok(),
            DeleteUserResult.UserNotFound => NotFound(),
            _ => BadRequest(new ProblemDetails { Title = "Bad request", Detail = "Cannot delete ServerAdmin user" })
        };
    }

    /// <summary>
    /// Generate a token
    /// </summary>
    /// <returns></returns>
    [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
    [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
    [ProducesResponseType(StatusCodes.Status200OK)]
    [ProducesResponseType(typeof(ProblemDetails), StatusCodes.Status400BadRequest)]
    [HttpPost("auth/token")]
    public async Task<ActionResult<TokenResult>> GetToken([FromBody] UserDto credentials)
    {
        var validationResult = await _userService.ValidateCredentials(credentials);

        if (validationResult.Result != ValidationResult.Success)
        {
            return BadRequest(new ProblemDetails
            {
                Title = "Login failed",
                Detail = validationResult.Result.ToString()
            });
        }

        var permissions = validationResult.User.Roles.Select(x => x.Permission.ToString()).ToArray();

        var token = _tokenProvider.GenerateToken(validationResult.User.Login!,
            validationResult.User.Type.ToString(), permissions);

        return Ok(new TokenResult(token.Item1, token.Item2));
    }
}
