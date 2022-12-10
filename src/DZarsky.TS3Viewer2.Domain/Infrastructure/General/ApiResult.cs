namespace DZarsky.TS3Viewer2.Domain.Infrastructure.General
{
    public class ApiResult<TResult> : IApiResult<TResult>
    {
        public ApiResult(TResult result, bool isSuccess, string? reasonCode = null, string? message = null)
        {
            IsSuccess = isSuccess;
            Result = result;
            ReasonCode = reasonCode;
            Message = message;
        }

        public bool IsSuccess { get; set; }

        public string? ReasonCode { get; set; }

        public string? Message { get; set; }

        public TResult? Result { get; set; }
    }

    public static class ApiResult
    {
        public static ApiResult<TResult> Build<TResult>(TResult result, bool isSuccess = true, string? reasonCode = null, string? message = null)
        {
            return new ApiResult<TResult>(result, isSuccess, reasonCode, message);
        }

    }
}
