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
        return !string.IsNullOrWhiteSpace(result.ReasonCode) ? GetResponse(result) : Ok(result.Result);
    }

    protected ActionResult ApiResultToActionResult(IApiResult result)
    {
        return !string.IsNullOrWhiteSpace(result.ReasonCode) ? GetResponse(result) : Ok();
    }

    private ActionResult GetResponse(IApiResult result)
    {
        return result.ReasonCode switch
        {
            ReasonCodes.Forbidden => Forbid(),
            ReasonCodes.NotFound => NotFound(),
            ReasonCodes.NoContent => NoContent(),
            ReasonCodes.TooManyRequests => StatusCode(StatusCodes.Status429TooManyRequests),
            ReasonCodes.ExternalServerError => StatusCode(502,
                new ProblemDetails { Title = "Bad Gateway", Detail = result.Message }),
            _ => BadRequest(new ProblemDetails { Title = result.ReasonCode, Detail = result.Message })
        };
    }
}
