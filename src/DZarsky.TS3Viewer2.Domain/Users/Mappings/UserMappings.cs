using AutoMapper;
using DZarsky.TS3Viewer2.Domain.Users.Dto;
using DZarsky.TS3Viewer2.Domain.Users.Models;

namespace DZarsky.TS3Viewer2.Domain.Users.Mappings;

public sealed class UserMappings : Profile
{
    public UserMappings()
    {
        CreateMap<User, UserDto>().ReverseMap();
        CreateMap<User, UserInfoDto>().ReverseMap();
        CreateMap<UserRole, UserRoleDto>().ReverseMap();
    }
}
