namespace DZarsky.TS3Viewer2.Domain.Users.Models;

public sealed class User
{
    public int Id { get; set; }

    /// <summary>
    /// The unique TeamSpeak ID as login
    /// </summary>
    public string? Login { get; set; }

    /// <summary>
    /// The password
    /// </summary>
    public string? Secret { get; set; }

    public UserType Type { get; set; }

    public bool IsActive { get; set; }
}
