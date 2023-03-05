using DZarsky.TS3Viewer2.Domain.Users.Models;

namespace DZarsky.TS3Viewer2.Domain.Users.Dto;

public sealed class UserDto
{
    public string? Login { get; set; }

    public string? Secret { get; set; }

    public IList<Permission> Permissions { get; set; } = new List<Permission>();
}
