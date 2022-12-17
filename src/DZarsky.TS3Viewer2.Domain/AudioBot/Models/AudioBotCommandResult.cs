namespace DZarsky.TS3Viewer2.Domain.AudioBot.Models;

public sealed class AudioBotCommandResult
{
    public int ErrorCode { get; set; }

    public string? ErrorName { get; set; }

    public string? ErrorMessage { get; set; }
}
