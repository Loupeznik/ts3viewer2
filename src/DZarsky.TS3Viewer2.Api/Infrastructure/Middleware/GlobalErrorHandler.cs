using System.Text.Json;
using Microsoft.AspNetCore.Mvc;
using Sentry;

namespace DZarsky.TS3Viewer2.Api.Infrastructure.Middleware;

public sealed class GlobalErrorHandler
{
    private readonly RequestDelegate _next;

    public GlobalErrorHandler(RequestDelegate next)
    {
        _next = next;
    }

    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            var error = SentrySdk.CaptureException(ex);

            var problemDetails = new ProblemDetails
            {
                Title = "An error has occurred",
                Status = 500,
                Detail = ex.Message,
                Instance = error.ToString()
            };

            context.Response.StatusCode = 500;
            context.Response.ContentType = "application/problem+json";

            await context.Response.WriteAsync(JsonSerializer.Serialize(problemDetails));
        }
    }
}
