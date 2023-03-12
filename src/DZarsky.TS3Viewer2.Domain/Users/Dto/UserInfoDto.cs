using DZarsky.TS3Viewer2.Domain.Users.Models;

namespace DZarsky.TS3Viewer2.Domain.Users.Dto;

public sealed class UserInfoDto
{
    public int? Id { get; set; }

    public string? Login { get; set; }

    public IList<UserRoleDto> Roles { get; set; } = new List<UserRoleDto>();

    public UserType Type { get; set; }

    public bool IsActive { get; set; }
}
