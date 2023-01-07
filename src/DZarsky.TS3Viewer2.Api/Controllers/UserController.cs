using DZarsky.TS3Viewer2.Api.Infrastructure.Security;
using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using DZarsky.TS3Viewer2.Domain.Users.Dto;
using DZarsky.TS3Viewer2.Domain.Users.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace DZarsky.TS3Viewer2.Api.Controllers
{
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
        [Authorize(Policy = "App")]
        public async Task<ActionResult> AddUser([FromBody] UserDto user)
        {
            var result = await _userService.AddUser(user);

            if (result != Domain.Users.General.AddUserResult.Success)
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

            if (validationResult.User == null || validationResult.Result != Domain.Users.General.ValidationResult.Success)
            {
                return BadRequest(new ProblemDetails
                {
                    Title = "Login failed",
                    Detail = validationResult.Result.ToString()
                });
            }

            var token = _tokenProvider.GenerateToken(validationResult.User.Login!, validationResult.User.Type.ToString());

            return Ok(new TokenResult(token.Item1, token.Item2));
        }
    }
}
