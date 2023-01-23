namespace DZarsky.TS3Viewer2.Domain.Server.Dto;

public sealed class ClientDetailDto
{
    public string? Version { get; set; }

    public string? Plattform { get; set; }

    public string? Description { get; set; }

    public bool InputMuted { get; set; }

    public bool OutputMuted { get; set; }

    public bool OutputOnlyMuted { get; set; }

    public bool IsRecording { get; set; }

    public IReadOnlyList<int>? ServerGroupIds { get; set; }

    public IReadOnlyList<int>? ChannelGroupsIds { get; set; }

    public int TotalConnectionCount { get; set; }

    public bool Away { get; set; }

    public bool IsClientTalking { get; set; }

    public string? AwayMessage { get; set; }
}
