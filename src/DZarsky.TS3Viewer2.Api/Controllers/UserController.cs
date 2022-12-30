using DZarsky.TS3Viewer2.Api.Infrastructure.Security;
using DZarsky.TS3Viewer2.Domain.Users.Models;
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
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [HttpPost]
        public async Task<ActionResult<bool>> AddUser([FromBody] User user) => ApiResultToActionResult(await _userService.AddUser(user));

        /// <summary>
        /// Gets a token
        /// </summary>
        /// <returns></returns>
        [ProducesResponseType(typeof(object), StatusCodes.Status403Forbidden)]
        [ProducesResponseType(typeof(object), StatusCodes.Status401Unauthorized)]
        [ProducesResponseType(StatusCodes.Status200OK)]
        [ProducesResponseType(typeof(object), StatusCodes.Status400BadRequest)]
        [HttpPost("auth/token")]
        public async Task<ActionResult<object>> GetToken([FromBody] User user)
        {
            var token = _tokenProvider.GenerateToken();

            return new ActionResult<object>(new
            {
                token
            });
        }
    }
}
