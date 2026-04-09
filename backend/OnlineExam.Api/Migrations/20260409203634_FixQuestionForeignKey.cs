using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OnlineExam.Api.Migrations
{
    /// <inheritdoc />
    public partial class FixQuestionForeignKey : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("1dd815c4-1535-449f-b20d-a4d78ac2546d"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("5facca79-cdfa-4c63-9c6c-937fb369610f"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("966ecb79-92f2-4122-bc76-c57d77b94c2b"));

            migrationBuilder.AddColumn<int>(
                name: "Points",
                table: "Questions",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "Type",
                table: "Questions",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("2111513c-e30b-4286-b2b8-7a2babfa3703"), new DateTime(2026, 4, 9, 20, 36, 33, 828, DateTimeKind.Utc).AddTicks(267), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" },
                    { new Guid("a120fe37-341f-4dde-90e6-122967fff74d"), new DateTime(2026, 4, 9, 20, 36, 33, 828, DateTimeKind.Utc).AddTicks(276), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" },
                    { new Guid("eb1100da-64be-4eef-9b4a-e6aecc5e0502"), new DateTime(2026, 4, 9, 20, 36, 33, 828, DateTimeKind.Utc).AddTicks(279), "student@onlineexam.com", "Student", true, "Password123!", "Student" }
                });
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("2111513c-e30b-4286-b2b8-7a2babfa3703"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("a120fe37-341f-4dde-90e6-122967fff74d"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("eb1100da-64be-4eef-9b4a-e6aecc5e0502"));

            migrationBuilder.DropColumn(
                name: "Points",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "Type",
                table: "Questions");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("1dd815c4-1535-449f-b20d-a4d78ac2546d"), new DateTime(2026, 4, 6, 21, 40, 38, 846, DateTimeKind.Utc).AddTicks(3434), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" },
                    { new Guid("5facca79-cdfa-4c63-9c6c-937fb369610f"), new DateTime(2026, 4, 6, 21, 40, 38, 846, DateTimeKind.Utc).AddTicks(3454), "student@onlineexam.com", "Student", true, "Password123!", "Student" },
                    { new Guid("966ecb79-92f2-4122-bc76-c57d77b94c2b"), new DateTime(2026, 4, 6, 21, 40, 38, 846, DateTimeKind.Utc).AddTicks(3450), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" }
                });
        }
    }
}
