using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814 // Prefer jagged arrays over multidimensional

namespace OnlineExam.Api.Migrations
{
    /// <inheritdoc />
    public partial class RemoveShadowExamId1 : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
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
                name: "ExamId1",
                table: "Questions");

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

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
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

            migrationBuilder.AddColumn<Guid>(
                name: "ExamId1",
                table: "Questions",
                type: "uuid",
                nullable: true);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("2111513c-e30b-4286-b2b8-7a2babfa3703"), new DateTime(2026, 4, 9, 20, 36, 33, 828, DateTimeKind.Utc).AddTicks(267), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" },
                    { new Guid("a120fe37-341f-4dde-90e6-122967fff74d"), new DateTime(2026, 4, 9, 20, 36, 33, 828, DateTimeKind.Utc).AddTicks(276), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" },
                    { new Guid("eb1100da-64be-4eef-9b4a-e6aecc5e0502"), new DateTime(2026, 4, 9, 20, 36, 33, 828, DateTimeKind.Utc).AddTicks(279), "student@onlineexam.com", "Student", true, "Password123!", "Student" }
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
    }
}
