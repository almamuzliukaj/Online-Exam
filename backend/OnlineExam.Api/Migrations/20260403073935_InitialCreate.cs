using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OnlineExam.Api.Migrations
{
    /// <inheritdoc />
    public partial class InitialCreate : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.CreateTable(
                name: "Users",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    FullName = table.Column<string>(type: "text", nullable: false),
                    Email = table.Column<string>(type: "text", nullable: false),
                    PasswordHash = table.Column<string>(type: "text", nullable: false),
                    Role = table.Column<string>(type: "text", nullable: false),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Users", x => x.Id);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("17ef169c-c82d-44e3-8d24-e1fdc6ecf3be"), new DateTime(2026, 4, 3, 7, 39, 33, 56, DateTimeKind.Utc).AddTicks(3244), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" },
                    { new Guid("e0f054d5-d476-40d7-b57f-727165dc0e18"), new DateTime(2026, 4, 3, 7, 39, 33, 56, DateTimeKind.Utc).AddTicks(3240), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" },
                    { new Guid("ea3f5ee5-638d-416c-9ef9-3f614007342e"), new DateTime(2026, 4, 3, 7, 39, 33, 56, DateTimeKind.Utc).AddTicks(3246), "student@onlineexam.com", "Student", true, "Password123!", "Student" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Users");
        }
    }
}
