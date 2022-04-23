namespace DZarsky.TS3Viewer2.Domain.Server.Models;

public class ServerInstance
{
    public string? Host { get; set; }
    
    public int Port { get; set; }
    
    public string? Login { get; set; }
    
    public string? Token { get; set; }
    
    public int ServerID { get; set; }
}
