using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace DZarsky.TS3Viewer2.Data.Migrations
{
    /// <inheritdoc />
    public partial class AddDefaultReactUser : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            var secret = Guid.NewGuid().ToString();

            migrationBuilder.Sql($"INSERT INTO Users (Login, Secret, Type) VALUES (\"react-app\", \"{secret}\", 0)");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.Sql("DELETE FROM Users WHERE Login = \"react-app\"");
        }
    }
}
