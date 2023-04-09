using DZarsky.TS3Viewer2.Domain.Infrastructure.General;

namespace DZarsky.TS3Viewer2.Domain.Infrastructure.Extensions;

public static class ApiResultExtensions
{
    public static ApiResult<TResult> ToApiResult<TResult>(this TResult? result, bool isSuccess = true, string? reasonCode = null, string? message = null) where TResult : class
    {
        return new ApiResult<TResult>(result, isSuccess, reasonCode, message);
    }

    public static ApiResult ToApiResult(bool isSuccess = true, string? reasonCode = null, string? message = null)
    {
        return new ApiResult(isSuccess, reasonCode, message);
    }
}
