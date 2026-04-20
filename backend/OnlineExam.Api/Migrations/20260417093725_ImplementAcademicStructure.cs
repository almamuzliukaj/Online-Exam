using System;
using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

#pragma warning disable CA1814

namespace OnlineExam.Api.Migrations
{
    public partial class ImplementAcademicStructure : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(
                name: "FK_CourseOfferings_Courses_CourseId",
                table: "CourseOfferings");

            migrationBuilder.DropForeignKey(
                name: "FK_CourseOfferings_Terms_TermId",
                table: "CourseOfferings");

            migrationBuilder.DropIndex(
                name: "IX_CourseOfferings_CourseId",
                table: "CourseOfferings");

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("b5769729-e575-4789-b6e7-f7327ede1acc"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("4c7b418b-5853-4c9c-9ef4-5e1d4e65cad1"));

            migrationBuilder.DeleteData(
                table: "Users",
                keyColumn: "Id",
                keyValue: new Guid("f9635e15-1d90-4e3b-b722-331a8fc2fbe9"));

            migrationBuilder.DropColumn(name: "Year", table: "Terms");

            migrationBuilder.RenameColumn(
                name: "ProfessorId",
                table: "CourseOfferings",
                newName: "PrimaryProfessorId");

            migrationBuilder.AlterColumn<string>(
                name: "Season",
                table: "Terms",
                type: "character varying(20)",
                maxLength: 20,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<string>(name: "AcademicYearLabel", table: "Terms", type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<string>(name: "Code", table: "Terms", type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<DateTime>(name: "EndDate", table: "Terms", type: "timestamp with time zone", nullable: false, defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
            migrationBuilder.AddColumn<DateTime>(name: "EnrollmentCloseAt", table: "Terms", type: "timestamp with time zone", nullable: false, defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
            migrationBuilder.AddColumn<DateTime>(name: "EnrollmentOpenAt", table: "Terms", type: "timestamp with time zone", nullable: false, defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
            migrationBuilder.AddColumn<bool>(name: "IsCurrent", table: "Terms", type: "boolean", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<string>(name: "Name", table: "Terms", type: "character varying(100)", maxLength: 100, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<DateTime>(name: "StartDate", table: "Terms", type: "timestamp with time zone", nullable: false, defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
            migrationBuilder.AddColumn<string>(name: "Status", table: "Terms", type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<Guid>(name: "CourseOfferingId", table: "Exams", type: "uuid", nullable: true);

            migrationBuilder.AlterColumn<string>(
                name: "Name",
                table: "Courses",
                type: "character varying(200)",
                maxLength: 200,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AlterColumn<string>(
                name: "Code",
                table: "Courses",
                type: "character varying(50)",
                maxLength: 50,
                nullable: false,
                oldClrType: typeof(string),
                oldType: "text");

            migrationBuilder.AddColumn<int>(name: "Credits", table: "Courses", type: "integer", nullable: false, defaultValue: 0);
            migrationBuilder.AddColumn<int>(name: "DefaultSemesterNo", table: "Courses", type: "integer", nullable: false, defaultValue: 0);
            migrationBuilder.AddColumn<string>(name: "Description", table: "Courses", type: "character varying(1000)", maxLength: 1000, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<bool>(name: "IsActive", table: "Courses", type: "boolean", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<bool>(name: "IsElective", table: "Courses", type: "boolean", nullable: false, defaultValue: false);
            migrationBuilder.AddColumn<int>(name: "YearOfStudy", table: "Courses", type: "integer", nullable: false, defaultValue: 0);

            migrationBuilder.AddColumn<int>(name: "Capacity", table: "CourseOfferings", type: "integer", nullable: false, defaultValue: 0);
            migrationBuilder.AddColumn<DateTime>(name: "CreatedAt", table: "CourseOfferings", type: "timestamp with time zone", nullable: false, defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));
            migrationBuilder.AddColumn<string>(name: "DeliveryType", table: "CourseOfferings", type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<string>(name: "SectionCode", table: "CourseOfferings", type: "character varying(50)", maxLength: 50, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<string>(name: "Status", table: "CourseOfferings", type: "character varying(20)", maxLength: 20, nullable: false, defaultValue: "");
            migrationBuilder.AddColumn<DateTime>(name: "UpdatedAt", table: "CourseOfferings", type: "timestamp with time zone", nullable: false, defaultValue: new DateTime(1, 1, 1, 0, 0, 0, 0, DateTimeKind.Unspecified));

            migrationBuilder.CreateTable(
                name: "CarryOverCourses",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseId = table.Column<Guid>(type: "uuid", nullable: false),
                    OriginTermId = table.Column<Guid>(type: "uuid", nullable: false),
                    OriginSemesterNo = table.Column<int>(type: "integer", nullable: false),
                    Reason = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    SourceResultId = table.Column<Guid>(type: "uuid", nullable: true),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    ResolvedByPassingOfferingId = table.Column<Guid>(type: "uuid", nullable: true),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ClosedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CarryOverCourses", x => x.Id);
                    table.ForeignKey(name: "FK_CarryOverCourses_Courses_CourseId", column: x => x.CourseId, principalTable: "Courses", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(name: "FK_CarryOverCourses_Terms_OriginTermId", column: x => x.OriginTermId, principalTable: "Terms", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "CourseOfferingStaffAssignments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uuid", nullable: false),
                    UserId = table.Column<Guid>(type: "uuid", nullable: false),
                    RoleInOffering = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    AssignmentType = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    PermissionsProfile = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    AssignedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    AssignedBy = table.Column<Guid>(type: "uuid", nullable: false),
                    RevokedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: true),
                    RevokedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    IsActive = table.Column<bool>(type: "boolean", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_CourseOfferingStaffAssignments", x => x.Id);
                    table.ForeignKey(name: "FK_CourseOfferingStaffAssignments_CourseOfferings_CourseOfferi~", column: x => x.CourseOfferingId, principalTable: "CourseOfferings", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
                });

            migrationBuilder.CreateTable(
                name: "SemesterEnrollments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    TermId = table.Column<Guid>(type: "uuid", nullable: false),
                    YearOfStudy = table.Column<int>(type: "integer", nullable: false),
                    SemesterNo = table.Column<int>(type: "integer", nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    EnrolledAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    ApprovedBy = table.Column<Guid>(type: "uuid", nullable: true),
                    Notes = table.Column<string>(type: "character varying(1000)", maxLength: 1000, nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_SemesterEnrollments", x => x.Id);
                    table.ForeignKey(name: "FK_SemesterEnrollments_Terms_TermId", column: x => x.TermId, principalTable: "Terms", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateTable(
                name: "StudentCourseEnrollments",
                columns: table => new
                {
                    Id = table.Column<Guid>(type: "uuid", nullable: false),
                    StudentId = table.Column<Guid>(type: "uuid", nullable: false),
                    CourseOfferingId = table.Column<Guid>(type: "uuid", nullable: false),
                    LinkedSemesterEnrollmentId = table.Column<Guid>(type: "uuid", nullable: true),
                    EnrollmentSource = table.Column<string>(type: "character varying(30)", maxLength: 30, nullable: false),
                    Status = table.Column<string>(type: "character varying(20)", maxLength: 20, nullable: false),
                    EligibleForExam = table.Column<bool>(type: "boolean", nullable: false),
                    CreatedAt = table.Column<DateTime>(type: "timestamp with time zone", nullable: false),
                    CreatedBy = table.Column<Guid>(type: "uuid", nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_StudentCourseEnrollments", x => x.Id);
                    table.ForeignKey(name: "FK_StudentCourseEnrollments_CourseOfferings_CourseOfferingId", column: x => x.CourseOfferingId, principalTable: "CourseOfferings", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
                    table.ForeignKey(name: "FK_StudentCourseEnrollments_SemesterEnrollments_LinkedSemester~", column: x => x.LinkedSemesterEnrollmentId, principalTable: "SemesterEnrollments", principalColumn: "Id", onDelete: ReferentialAction.SetNull);
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

            migrationBuilder.CreateIndex(name: "IX_Terms_Code", table: "Terms", column: "Code", unique: true);
            migrationBuilder.CreateIndex(name: "IX_Exams_CourseOfferingId", table: "Exams", column: "CourseOfferingId");
            migrationBuilder.CreateIndex(name: "IX_Courses_Code", table: "Courses", column: "Code", unique: true);
            migrationBuilder.CreateIndex(name: "IX_CourseOfferings_CourseId_TermId_SectionCode", table: "CourseOfferings", columns: new[] { "CourseId", "TermId", "SectionCode" }, unique: true);
            migrationBuilder.CreateIndex(name: "IX_CarryOverCourses_CourseId", table: "CarryOverCourses", column: "CourseId");
            migrationBuilder.CreateIndex(name: "IX_CarryOverCourses_OriginTermId", table: "CarryOverCourses", column: "OriginTermId");
            migrationBuilder.CreateIndex(name: "IX_CourseOfferingStaffAssignments_CourseOfferingId", table: "CourseOfferingStaffAssignments", column: "CourseOfferingId");
            migrationBuilder.CreateIndex(name: "IX_SemesterEnrollments_TermId", table: "SemesterEnrollments", column: "TermId");
            migrationBuilder.CreateIndex(name: "IX_StudentCourseEnrollments_CourseOfferingId", table: "StudentCourseEnrollments", column: "CourseOfferingId");
            migrationBuilder.CreateIndex(name: "IX_StudentCourseEnrollments_LinkedSemesterEnrollmentId", table: "StudentCourseEnrollments", column: "LinkedSemesterEnrollmentId");
            migrationBuilder.CreateIndex(name: "IX_StudentCourseEnrollments_StudentId_CourseOfferingId", table: "StudentCourseEnrollments", columns: new[] { "StudentId", "CourseOfferingId" }, unique: true);

            migrationBuilder.AddForeignKey(name: "FK_CourseOfferings_Courses_CourseId", table: "CourseOfferings", column: "CourseId", principalTable: "Courses", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(name: "FK_CourseOfferings_Terms_TermId", table: "CourseOfferings", column: "TermId", principalTable: "Terms", principalColumn: "Id", onDelete: ReferentialAction.Restrict);
            migrationBuilder.AddForeignKey(name: "FK_Exams_CourseOfferings_CourseOfferingId", table: "Exams", column: "CourseOfferingId", principalTable: "CourseOfferings", principalColumn: "Id", onDelete: ReferentialAction.SetNull);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropForeignKey(name: "FK_CourseOfferings_Courses_CourseId", table: "CourseOfferings");
            migrationBuilder.DropForeignKey(name: "FK_CourseOfferings_Terms_TermId", table: "CourseOfferings");
            migrationBuilder.DropForeignKey(name: "FK_Exams_CourseOfferings_CourseOfferingId", table: "Exams");
            migrationBuilder.DropTable(name: "CarryOverCourses");
            migrationBuilder.DropTable(name: "CourseOfferingStaffAssignments");
            migrationBuilder.DropTable(name: "StudentCourseEnrollments");
            migrationBuilder.DropTable(name: "SemesterEnrollments");
            migrationBuilder.DropIndex(name: "IX_Terms_Code", table: "Terms");
            migrationBuilder.DropIndex(name: "IX_Exams_CourseOfferingId", table: "Exams");
            migrationBuilder.DropIndex(name: "IX_Courses_Code", table: "Courses");
            migrationBuilder.DropIndex(name: "IX_CourseOfferings_CourseId_TermId_SectionCode", table: "CourseOfferings");

            migrationBuilder.DeleteData(table: "Users", keyColumn: "Id", keyValue: new Guid("4c7b418b-5853-4c9c-9ef4-5e1d4e65cad1"));
            migrationBuilder.DeleteData(table: "Users", keyColumn: "Id", keyValue: new Guid("b5769729-e575-4789-b6e7-f7327ede1acc"));
            migrationBuilder.DeleteData(table: "Users", keyColumn: "Id", keyValue: new Guid("f9635e15-1d90-4e3b-b722-331a8fc2fbe9"));

            migrationBuilder.DropColumn(name: "AcademicYearLabel", table: "Terms");
            migrationBuilder.DropColumn(name: "Code", table: "Terms");
            migrationBuilder.DropColumn(name: "EndDate", table: "Terms");
            migrationBuilder.DropColumn(name: "EnrollmentCloseAt", table: "Terms");
            migrationBuilder.DropColumn(name: "EnrollmentOpenAt", table: "Terms");
            migrationBuilder.DropColumn(name: "IsCurrent", table: "Terms");
            migrationBuilder.DropColumn(name: "Name", table: "Terms");
            migrationBuilder.DropColumn(name: "StartDate", table: "Terms");
            migrationBuilder.DropColumn(name: "Status", table: "Terms");
            migrationBuilder.DropColumn(name: "CourseOfferingId", table: "Exams");
            migrationBuilder.DropColumn(name: "Credits", table: "Courses");
            migrationBuilder.DropColumn(name: "DefaultSemesterNo", table: "Courses");
            migrationBuilder.DropColumn(name: "Description", table: "Courses");
            migrationBuilder.DropColumn(name: "IsActive", table: "Courses");
            migrationBuilder.DropColumn(name: "IsElective", table: "Courses");
            migrationBuilder.DropColumn(name: "YearOfStudy", table: "Courses");
            migrationBuilder.DropColumn(name: "Capacity", table: "CourseOfferings");
            migrationBuilder.DropColumn(name: "CreatedAt", table: "CourseOfferings");
            migrationBuilder.DropColumn(name: "DeliveryType", table: "CourseOfferings");
            migrationBuilder.DropColumn(name: "SectionCode", table: "CourseOfferings");
            migrationBuilder.DropColumn(name: "Status", table: "CourseOfferings");
            migrationBuilder.DropColumn(name: "UpdatedAt", table: "CourseOfferings");

            migrationBuilder.RenameColumn(name: "PrimaryProfessorId", table: "CourseOfferings", newName: "ProfessorId");

            migrationBuilder.AlterColumn<string>(name: "Season", table: "Terms", type: "text", nullable: false, oldClrType: typeof(string), oldType: "character varying(20)", oldMaxLength: 20);
            migrationBuilder.AddColumn<int>(name: "Year", table: "Terms", type: "integer", nullable: false, defaultValue: 0);
            migrationBuilder.AlterColumn<string>(name: "Name", table: "Courses", type: "text", nullable: false, oldClrType: typeof(string), oldType: "character varying(200)", oldMaxLength: 200);
            migrationBuilder.AlterColumn<string>(name: "Code", table: "Courses", type: "text", nullable: false, oldClrType: typeof(string), oldType: "character varying(50)", oldMaxLength: 50);

            migrationBuilder.InsertData(
                table: "Users",
                columns: new[] { "Id", "CreatedAt", "Email", "FullName", "IsActive", "PasswordHash", "Role" },
                values: new object[,]
                {
                    { new Guid("4c7b418b-5853-4c9c-9ef4-5e1d4e65cad1"), new DateTime(2026, 4, 17, 8, 21, 26, 122, DateTimeKind.Utc).AddTicks(549), "student@onlineexam.com", "Student", true, "Password123!", "Student" },
                    { new Guid("b5769729-e575-4789-b6e7-f7327ede1acc"), new DateTime(2026, 4, 17, 8, 21, 26, 122, DateTimeKind.Utc).AddTicks(546), "prof@onlineexam.com", "Professor", true, "Password123!", "Professor" },
                    { new Guid("f9635e15-1d90-4e3b-b722-331a8fc2fbe9"), new DateTime(2026, 4, 17, 8, 21, 26, 122, DateTimeKind.Utc).AddTicks(538), "admin@onlineexam.com", "Admin User", true, "Password123!", "Admin" }
                });

            migrationBuilder.CreateIndex(name: "IX_CourseOfferings_CourseId", table: "CourseOfferings", column: "CourseId");
            migrationBuilder.AddForeignKey(name: "FK_CourseOfferings_Courses_CourseId", table: "CourseOfferings", column: "CourseId", principalTable: "Courses", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
            migrationBuilder.AddForeignKey(name: "FK_CourseOfferings_Terms_TermId", table: "CourseOfferings", column: "TermId", principalTable: "Terms", principalColumn: "Id", onDelete: ReferentialAction.Cascade);
        }
    }
}
