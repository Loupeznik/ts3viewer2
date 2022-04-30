using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using TeamSpeak3QueryApi.Net.Specialized.Responses;

namespace DZarsky.TS3Viewer2.Domain.Server.Mappings;

public class ChannelMappings : Profile
{
    public ChannelMappings()
    {
        CreateMap<GetChannelListInfo, ChannelDto>().ReverseMap();
    }
}
