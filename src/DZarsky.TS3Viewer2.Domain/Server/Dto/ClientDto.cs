using TeamSpeak3QueryApi.Net.Specialized;

namespace DZarsky.TS3Viewer2.Domain.Server.Dto;

public sealed class ClientDto
{
    public int Id { get; set; }

    public int ChannelId { get; set; }

    public int DatabaseId { get; set; }

    public string? NickName { get; set; }

    public ClientType Type { get; set; }

    public ClientDetailDto? Detail { get; set; }
}
