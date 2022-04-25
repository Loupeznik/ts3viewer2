namespace DZarsky.TS3Viewer2.Domain.Server.Dto;

public class BanClientDto
{
    /// <summary>
    /// The ban duration in seconds
    /// </summary>
    public double Duration { get; set; }
    
    public string? Reason { get; set; }
}
