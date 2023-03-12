using DZarsky.TS3Viewer2.Data.Configuration;
using DZarsky.TS3Viewer2.Domain.Users.Models;
using Microsoft.EntityFrameworkCore;

namespace DZarsky.TS3Viewer2.Data.Infrastructure;

public sealed class DataContext : DbContext
{
    public DbSet<User> Users { get; set; } = default!;
    public DbSet<UserRole> UserRoles { get; set; } = default!;

    public DataContext(DbContextOptions options) : base(options)
    {

    }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        modelBuilder.AddUserConfig();
        modelBuilder.AddUserRoleConfig();
    }
}
