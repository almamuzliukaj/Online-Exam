using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OnlineExam.Api.Migrations
{
    /// <inheritdoc />
    public partial class AddExamStatus : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
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

            migrationBuilder.AddColumn<string>(
                name: "CorrectAnswer",
                table: "Questions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<Guid>(
                name: "CourseId",
                table: "Questions",
                type: "uuid",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Difficulty",
                table: "Questions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Status",
                table: "Exams",
                type: "text",
                nullable: false,
                defaultValue: "");

            migrationBuilder.CreateTable(
                name: "ExamAttempts",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    ExamId = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    SubmittedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AnswersJson = table.Column<string>(type: "text", nullable: false),
                    Score = table.Column<double>(type: "double precision", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_ExamAttempts", x => x.Id);
                    table.ForeignKey(
                        name: "FK_ExamAttempts_Exams_ExamId",
                        column: x => x.ExamId,
                        principalTable: "Exams",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Cascade);
                    table.ForeignKey(
                        name: "FK_ExamAttempts_Users_StudentId",
                        column: x => x.StudentId,
                        principalTable: "Users",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("4c7b418b-5853-4c9c-9ef4-5e1d4e65cad1"), new DateTime(2026, 4, 17, 8, 21, 26, 122, DateTimeKind.Utc).AddTicks(549), "student@onlineexam.com", "Student", true, "Password123!", "Student" },
                    { new Guid("b5769729-e575-4789-b6e7-f7327ede1acc"), new DateTime(2026, 4, 17, 8, 21, 26, 122, DateTimeKind.Utc).AddTicks(546), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" },
                    { new Guid("f9635e15-1d90-4e3b-b722-331a8fc2fbe9"), new DateTime(2026, 4, 17, 8, 21, 26, 122, DateTimeKind.Utc).AddTicks(538), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" }
                });

            migrationBuilder.CreateIndex(
                name: "IX_ExamAttempts_ExamId",
                table: "ExamAttempts",
                column: "ExamId");

            migrationBuilder.CreateIndex(
                name: "IX_ExamAttempts_StudentId",
                table: "ExamAttempts",
                column: "StudentId");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "ExamAttempts");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("4c7b418b-5853-4c9c-9ef4-5e1d4e65cad1"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("b5769729-e575-4789-b6e7-f7327ede1acc"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f9635e15-1d90-4e3b-b722-331a8fc2fbe9"));

            migrationBuilder.DropColumn(
                name: "CorrectAnswer",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "CourseId",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "Difficulty",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "Status",
                table: "Exams");

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("59f80a88-fc46-4377-a4bf-700099bd37ba"), new DateTime(2026, 4, 13, 20, 44, 36, 925, DateTimeKind.Utc).AddTicks(1422), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" },
                    { new Guid("636391af-8eb5-43c4-946d-482b7f901604"), new DateTime(2026, 4, 13, 20, 44, 36, 925, DateTimeKind.Utc).AddTicks(1426), "student@onlineexam.com", "Student", true, "Password123!", "Student" },
                    { new Guid("ebe11f61-7c26-439f-8bdf-994c64844c96"), new DateTime(2026, 4, 13, 20, 44, 36, 925, DateTimeKind.Utc).AddTicks(1415), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" }
                });
        }
    }
}
