namespace DZarsky.TS3Viewer2.Domain.Server.Dto;

public class ServerInfoDto
{
    public int Id { get; set; }
    
    public string? Status { get; set; }
    
    public int ClientsOnline { get; set; }
    
    public int QueriesOnline { get; set; }
    
    public int MaxClients { get; set; }
    
    public string? Uptime { get; set; }
    
    public string? Name { get; set; }
}
