namespace DZarsky.TS3Viewer2.Domain.Users.Models;

public sealed class UserRole
{
    public int Id { get; set; }

    public User? User { get; set; }

    public int UserId { get; set; }

    public Permission Permission { get; set; }
}
