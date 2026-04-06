using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OnlineExam.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddCreatedByUserIdToExam : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("1e8c1a4e-ba02-4697-a771-2f2d1a6ee175"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("bd980cb2-6547-4bd4-b6a5-12b94c02a8e7"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("fa9c9340-1789-4400-b225-0c1bfcfe5c71"));

            migrationBuilder.RenameColumn(
                name: "OwnerId",
                table: "Exams",
                newName: "CreatedByUserId");

            migrationBuilder.AddColumn<Guid>(
                name: "ExamId1",
                table: "Questions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "DurationMinutes",
                table: "Exams",
                type: "integer",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<DateTime>(
                name: "EndsAt",
                table: "Exams",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.AddColumn<bool>(
                name: "IsPublished",
                table: "Exams",
                type: "boolean",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<DateTime>(
                name: "StartsAt",
                table: "Exams",
                type: "timestamp with time zone",
                nullable: false,
                defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("1dd815c4-1535-449f-b20d-a4d78ac2546d"), new DateTime(2026, 4, 6, 21, 40, 38, 846, DateTimeKind.Utc).AddTicks(3434), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" },
                    { new Guid("5facca79-cdfa-4c63-9c6c-937fb369610f"), new DateTime(2026, 4, 6, 21, 40, 38, 846, DateTimeKind.Utc).AddTicks(3454), "student@onlineexam.com", "Student", true, "Password123!", "Student" },
                    { new Guid("966ecb79-92f2-4122-bc76-c57d77b94c2b"), new DateTime(2026, 4, 6, 21, 40, 38, 846, DateTimeKind.Utc).AddTicks(3450), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Questions_ExamId1",
                table: "Questions",
                column: "ExamId1");

            migrationBuilder.AddForeignKey(
                name: "FK_Questions_Exams_ExamId1",
                table: "Questions",
                column: "ExamId1",
                principalTable: "Exams",
                principalColumn: "Id");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_Questions_Exams_ExamId1",
                table: "Questions");

            migrationBuilder.DropIndex(
                name: "IX_Questions_ExamId1",
                table: "Questions");

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

            migrationBuilder.DropColumn(
                name: "ExamId1",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "DurationMinutes",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "EndsAt",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "IsPublished",
                table: "Exams");

            migrationBuilder.DropColumn(
                name: "StartsAt",
                table: "Exams");

            migrationBuilder.RenameColumn(
                name: "CreatedByUserId",
                table: "Exams",
                newName: "OwnerId");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("1e8c1a4e-ba02-4697-a771-2f2d1a6ee175"), new DateTime(2026, 4, 6, 19, 37, 14, 748, DateTimeKind.Utc).AddTicks(2741), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" },
                    { new Guid("bd980cb2-6547-4bd4-b6a5-12b94c02a8e7"), new DateTime(2026, 4, 6, 19, 37, 14, 748, DateTimeKind.Utc).AddTicks(2752), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" },
                    { new Guid("fa9c9340-1789-4400-b225-0c1bfcfe5c71"), new DateTime(2026, 4, 6, 19, 37, 14, 748, DateTimeKind.Utc).AddTicks(2771), "student@onlineexam.com", "Student", true, "Password123!", "Student" }
                });
        }
    }
}
