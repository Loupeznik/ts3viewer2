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

    /// <summary>
    /// Converts ApiResult to ActionResult returned by the API
    /// </summary>
    /// <typeparam name="TResult"></typeparam>
    /// <param name="result">The ApiResult</param>
    /// <returns>Action result</returns>
    protected ActionResult<TResult> ApiResultToActionResult<TResult>(IApiResult<TResult> result) where TResult : class
    {
        if (!string.IsNullOrWhiteSpace(result.ReasonCode))
        {
            return GetResponse(result);
        }

        return Ok(result.Result);
    }

    protected ActionResult ApiResultToActionResult(IApiResult result)
    {
        if (!string.IsNullOrWhiteSpace(result.ReasonCode))
        {
            return GetResponse(result);
        }

        return Ok();
    }

    private ActionResult GetResponse(IApiResult result)
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
            case ReasonCodes.ExternalServerError:
                return StatusCode(502, new ProblemDetails
                {
                    Title = "Bad Gateway",
                    Detail = result.Message
                });
            default:
                return BadRequest(new ProblemDetails
                {
                    Title = result.ReasonCode,
                    Detail = result.Message
                });
        }
    }
}
