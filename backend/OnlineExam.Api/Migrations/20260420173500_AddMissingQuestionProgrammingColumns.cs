using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.EntityFrameworkCore.Migrations;
using OnlineExam.Api.Data;

#nullable disable

namespace OnlineExam.Api.Migrations
{
    [DbContext(typeof(AppDbContext))]
    [Migration("20260420173500_AddMissingQuestionProgrammingColumns")]
    public class AddMissingQuestionProgrammingColumns : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "AnswerLanguage",
                table: "Questions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "StarterCode",
                table: "Questions",
                type: "text",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "TestCasesJson",
                table: "Questions",
                type: "text",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "AnswerLanguage",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "StarterCode",
                table: "Questions");

            migrationBuilder.DropColumn(
                name: "TestCasesJson",
                table: "Questions");
        }
    }
}
