using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OnlineExam.Api.Migrations
{
    /// <inheritdoc />
    public partial class Sprint2_ExamAndQuestion : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("17ef169c-c82d-44e3-8d24-e1fdc6ecf3be"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("e0f054d5-d476-40d7-b57f-727165dc0e18"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("ea3f5ee5-638d-416c-9ef9-3f614007342e"));

            migrationBuilder.CreateTable(
                name: "Exams",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Title = table.Column<string>(type: "text", nullable: false),
                    Description = table.Column<string>(type: "text", nullable: false),
                    OwnerId = table.Column<Guid>(type: "uuid", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Exams", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Questions",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Text = table.Column<string>(type: "text", nullable: false),
                    ExamId = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Questions", x => x.Id);
                    table.ForeignKey(
                        name: "FK_Questions_Exams_ExamId",
                        column: x => x.ExamId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("1e8c1a4e-ba02-4697-a771-2f2d1a6ee175"), new DateTime(2026, 4, 6, 19, 37, 14, 748, DateTimeKind.Utc).AddTicks(2741), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" },
                    { new Guid("bd980cb2-6547-4bd4-b6a5-12b94c02a8e7"), new DateTime(2026, 4, 6, 19, 37, 14, 748, DateTimeKind.Utc).AddTicks(2752), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" },
                    { new Guid("fa9c9340-1789-4400-b225-0c1bfcfe5c71"), new DateTime(2026, 4, 6, 19, 37, 14, 748, DateTimeKind.Utc).AddTicks(2771), "student@onlineexam.com", "Student", true, "Password123!", "Student" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_Questions_ExamId",
                table: "Questions",
                column: "ExamId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Questions");

            migrationBuilder.DropTable(
                name: "Exams");

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
    }
}
