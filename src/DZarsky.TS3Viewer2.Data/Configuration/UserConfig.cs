using DZarsky.TS3Viewer2.Domain.Users.Models;
using Microsoft.EntityFrameworkCore;

namespace DZarsky.TS3Viewer2.Data.Configuration;

public static class UserConfig
{
    public static void AddUserConfig(this ModelBuilder builder)
    {
        var entity = builder.Entity<User>();

        entity
            .HasKey(x => x.Id);

        entity
            .HasIndex(x => x.Login)
            .IsUnique();

        entity
            .Property(x => x.IsActive)
            .HasDefaultValue(true);

        entity
            .HasMany(x => x.Roles)
            .WithOne(x => x.User)
            .HasForeignKey(x => x.UserId);
    }
}
