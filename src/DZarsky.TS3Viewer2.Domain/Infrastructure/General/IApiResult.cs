namespace DZarsky.TS3Viewer2.Domain.Infrastructure.General
{
    public interface IApiResult
    {
        bool IsSuccess { get; set; }

        string? ReasonCode { get; set; }

        string? Message { get; set; }
    }

    public interface IApiResult<TResult> : IApiResult where TResult : class
    {
        TResult? Result { get; set; }
    }
}
