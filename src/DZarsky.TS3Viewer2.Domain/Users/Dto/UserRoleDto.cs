using DZarsky.TS3Viewer2.Domain.Users.Models;

namespace DZarsky.TS3Viewer2.Domain.Users.Dto;

public sealed class UserRoleDto
{
    public int? Id { get; set; }

    public Permission Permission { get; set; }
}
