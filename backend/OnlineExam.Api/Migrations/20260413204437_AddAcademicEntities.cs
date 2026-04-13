using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OnlineExam.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddAcademicEntities : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("72f91bcd-254b-4dfc-98cc-9dece7506cb8"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("b17cb2e7-24c3-43ef-8cbe-9cadd3d05fc4"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("be5dc142-5672-481e-92bd-7ac772db21a1"));

            migrationBuilder.CreateTable(
                name: "Courses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Code = table.Column<string>(type: "text", nullable: false),
                    Name = table.Column<string>(type: "text", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Courses", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Terms",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    Season = table.Column<string>(type: "text", nullable: false),
                    Year = table.Column<int>(type: "integer", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Terms", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "CourseOfferings",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    TermId = table.Column<Guid>(type: "uuid", nullable: false),
                    YearOfStudy = table.Column<int>(type: "integer", nullable: false),
                    SemesterNo = table.Column<int>(type: "integer", nullable: false),
                    ProfessorId = table.Column<Guid>(type: "uuid", nullable: false),
                    AssistantId = table.Column<Guid>(type: "uuid", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseOfferings", x => x.Id);
                    table.ForeignKey(
                        name: "FK_CourseOfferings_Courses_CourseId",
                        column: x => x.CourseId,
                        principalTable: "Courses",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_CourseOfferings_Terms_TermId",
                        column: x => x.TermId,
                        principalTable: "Terms",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("59f80a88-fc46-4377-a4bf-700099bd37ba"), new DateTime(2026, 4, 13, 20, 44, 36, 925, DateTimeKind.Utc).AddTicks(1422), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" },
                    { new Guid("636391af-8eb5-43c4-946d-482b7f901604"), new DateTime(2026, 4, 13, 20, 44, 36, 925, DateTimeKind.Utc).AddTicks(1426), "student@onlineexam.com", "Student", true, "Password123!", "Student" },
                    { new Guid("ebe11f61-7c26-439f-8bdf-994c64844c96"), new DateTime(2026, 4, 13, 20, 44, 36, 925, DateTimeKind.Utc).AddTicks(1415), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_CourseOfferings_CourseId",
                table: "CourseOfferings",
                column: "CourseId");

            migrationBuilder.CreateIndex(
                name: "IX_CourseOfferings_TermId",
                table: "CourseOfferings",
                column: "TermId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "CourseOfferings");

            migrationBuilder.DropTable(
                name: "Courses");

            migrationBuilder.DropTable(
                name: "Terms");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("59f80a88-fc46-4377-a4bf-700099bd37ba"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("636391af-8eb5-43c4-946d-482b7f901604"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("ebe11f61-7c26-439f-8bdf-994c64844c96"));

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("72f91bcd-254b-4dfc-98cc-9dece7506cb8"), new DateTime(2026, 4, 9, 20, 41, 20, 30, DateTimeKind.Utc).AddTicks(4661), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" },
                    { new Guid("b17cb2e7-24c3-43ef-8cbe-9cadd3d05fc4"), new DateTime(2026, 4, 9, 20, 41, 20, 30, DateTimeKind.Utc).AddTicks(4655), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" },
                    { new Guid("be5dc142-5672-481e-92bd-7ac772db21a1"), new DateTime(2026, 4, 9, 20, 41, 20, 30, DateTimeKind.Utc).AddTicks(4665), "student@onlineexam.com", "Student", true, "Password123!", "Student" }
                });
        }
    }
}
