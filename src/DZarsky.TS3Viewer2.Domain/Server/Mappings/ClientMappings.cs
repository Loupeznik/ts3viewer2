﻿using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Server.Dto;
using TeamSpeak3QueryApi.Net.Specialized.Responses;

namespace DZarsky.TS3Viewer2.Domain.Server.Mappings;

public sealed class ClientMappings : Profile
{
    public ClientMappings()
    {
        CreateMap<GetClientInfo, ClientDto>().ReverseMap();
        CreateMap<GetClientDetailedInfo, ClientDetailDto>().ReverseMap();
    }
}
