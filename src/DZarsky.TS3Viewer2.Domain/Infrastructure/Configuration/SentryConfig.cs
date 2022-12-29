namespace DZarsky.TS3Viewer2.Domain.Infrastructure.Configuration
{
    public sealed class SentryConfig
    {
        public bool IsEnabled { get; set; }

        public string? Endpoint { get; set; }
    }
}
