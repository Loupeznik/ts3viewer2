namespace DZarsky.TS3Viewer2.Domain.Infrastructure.General
{
    public class ApiResult<TResult> : IApiResult<TResult> where TResult : class
    {
        public ApiResult(TResult? result, bool isSuccess, string? reasonCode = null, string? message = null)
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

    public class ApiResult : IApiResult
    {
        public ApiResult(bool isSuccess, string? reasonCode = null, string? message = null)
        {
            IsSuccess = isSuccess;
            ReasonCode = reasonCode;
            Message = message;
        }

        public bool IsSuccess { get; set; }
        public string? ReasonCode { get; set; }
        public string? Message { get; set; }
    }
}
