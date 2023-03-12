using DZarsky.TS3Viewer2.Domain.Users.Models;
using Microsoft.EntityFrameworkCore;

namespace DZarsky.TS3Viewer2.Data.Configuration;

public static class UserRoleConfig
{
    public static void AddUserRoleConfig(this ModelBuilder builder)
    {
        var entity = builder.Entity<UserRole>();

        entity
            .HasKey(x => x.Id);

        entity.HasIndex(x => new
        {
            x.UserId,
            x.Permission
        }).IsUnique();
    }
}
