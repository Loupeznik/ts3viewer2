using TeamSpeak3QueryApi.Net;

namespace DZarsky.TS3Viewer2.Domain.Server.Dto;

public class ChannelDto
{
    public int Id { get; set; }
    
    public int ParentChannelId { get; set; }
    
    public int Order { get; set; }

    public string Name { get; set; } = string.Empty;

    public string Topic { get; set; } = string.Empty;
    
    public bool IsDefaultChannel { get; set; }
    
    public bool HasPassword { get; set; }
    
    public bool IsPermanent { get; set; }
    
    public bool IsSemiPermanent { get; set; }
    
    public Codec Codec { get; set; }
    
    public int CodecQuality { get; set; }
    
    public int NeededTalkPower { get; set; }
    
    public long IconId { get; set; }

    public string DurationEmpty { get; set; } = string.Empty;
    
    public int TotalFamilyClients { get; set; }
    
    public int MaxClients { get; set; }
    
    public int MaxFamilyClients { get; set; }
    
    public int TotalClients { get; set; }
    
    public int NeededSubscribePower { get; set; }
}
