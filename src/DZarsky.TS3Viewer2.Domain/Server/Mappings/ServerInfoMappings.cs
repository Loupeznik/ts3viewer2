using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using TeamSpeak3QueryApi.Net.Specialized.Responses;

namespace DZarsky.TS3Viewer2.Domain.Server.Mappings;

public class ServerInfoMappings : Profile
{
    public ServerInfoMappings()
    {
        CreateMap<GetServerListInfo, ServerInfoDto>();
    }
}
