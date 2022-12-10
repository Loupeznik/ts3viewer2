using DZarsky.TS3Viewer2.Domain.Infrastructure.General;
using Microsoft.AspNetCore.Mvc;

namespace DZarsky.TS3Viewer2.Api.Controllers;

[ApiController]
public class ApiControllerBase : ControllerBase
{
    protected const string BaseUrl = "api/v1";

    protected ApiControllerBase()
    {

    }

    [Obsolete("Superseded by ApiResultToActionResult method")]
    protected ActionResult BoolToActionResult(bool result) => result ? Ok() : BadRequest();

    /// <summary>
    /// Converts ApiResult to ActionResult returned by the API
    /// </summary>
    /// <typeparam name="TResult"></typeparam>
    /// <param name="result">The ApiResult</param>
    /// <returns>Action result</returns>
    protected ActionResult<TResult> ApiResultToActionResult<TResult>(IApiResult<TResult> result)
    {
        if (!string.IsNullOrWhiteSpace(result.ReasonCode))
        {
            switch (result.ReasonCode)
            {
                case ReasonCodes.Forbidden:
                    return Forbid();
                case ReasonCodes.NotFound:
                    return NotFound();
                case ReasonCodes.NoContent:
                    return NoContent();
                case ReasonCodes.TooManyRequests:
                    return StatusCode(StatusCodes.Status429TooManyRequests);
                default:
                    return BadRequest(new ProblemDetails
                    {
                        Title = result.ReasonCode,
                        Detail = result.Message
                    });
            }
        }

        return Ok(result.Result);
    }
}
