using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Data;
using OnlineExam.Api.DTOs;
using OnlineExam.Api.Models;

namespace OnlineExam.Api.Controllers;

[ApiController]
[Route("api")]
[Authorize]
public class StudentCourseEnrollmentsController : ControllerBase
{
    private static readonly HashSet<string> AllowedSources = ["RegularSemester", "CarryOver", "ManualOverride"];
    private static readonly HashSet<string> AllowedStatuses = ["Eligible", "Locked", "Withdrawn", "Completed"];
    private readonly AppDbContext _context;

    public StudentCourseEnrollmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("students/{studentId:guid}/course-enrollments")]
    public async Task<IActionResult> GetStudentCourseEnrollments(Guid studentId, [FromQuery] Guid? termId)
    {
        if (!User.IsInRole("Admin") && GetCurrentUserId() != studentId)
            return Forbid();

        var query = _context.StudentCourseEnrollments
            .Include(x => x.CourseOffering)!
                .ThenInclude(x => x!.Course)
            .Include(x => x.CourseOffering)!
                .ThenInclude(x => x!.Term)
            .Where(x => x.StudentId == studentId);

        if (termId.HasValue)
            query = query.Where(x => x.CourseOffering!.TermId == termId.Value);

        var enrollments = await query
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(enrollments);
    }

    [HttpPost("students/{studentId:guid}/course-enrollments/regularize")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Regularize(Guid studentId, [FromQuery] Guid termId)
    {
        var student = await _context.Users.FirstOrDefaultAsync(x => x.Id == studentId && x.Role == "Student");
        if (student == null)
            return NotFound(new { message = "Student not found." });

        var enrollment = await _context.SemesterEnrollments
            .FirstOrDefaultAsync(x => x.StudentId == studentId && x.TermId == termId && x.Status == "Active");

        if (enrollment == null)
            return BadRequest(new { message = "Student must have an active semester enrollment for the term." });

        var offerings = await _context.CourseOfferings
            .Where(x =>
                x.TermId == termId &&
                x.YearOfStudy == enrollment.YearOfStudy &&
                x.SemesterNo == enrollment.SemesterNo &&
                x.Status != "Archived")
            .ToListAsync();

        var created = new List<StudentCourseEnrollment>();
        var currentUserId = GetCurrentUserId()!.Value;

        foreach (var offering in offerings)
        {
            var alreadyExists = await _context.StudentCourseEnrollments.AnyAsync(x => x.StudentId == studentId && x.CourseOfferingId == offering.Id);
            if (alreadyExists)
                continue;

            var row = new StudentCourseEnrollment
            {
                Id = Guid.NewGuid(),
                StudentId = studentId,
                CourseOfferingId = offering.Id,
                LinkedSemesterEnrollmentId = enrollment.Id,
                EnrollmentSource = "RegularSemester",
                Status = "Eligible",
                EligibleForExam = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = currentUserId
            };

            created.Add(row);
            _context.StudentCourseEnrollments.Add(row);
        }

        await _context.SaveChangesAsync();
        return Ok(new { created = created.Count, enrollments = created });
    }

    [HttpPost("students/{studentId:guid}/course-enrollments")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateStudentCourseEnrollment(Guid studentId, [FromBody] CreateStudentCourseEnrollmentDto dto)
    {
        var validationError = await ValidateStudentCourseEnrollmentAsync(studentId, dto.CourseOfferingId, dto.LinkedSemesterEnrollmentId, dto.EnrollmentSource, dto.Status);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        var exists = await _context.StudentCourseEnrollments.AnyAsync(x => x.StudentId == studentId && x.CourseOfferingId == dto.CourseOfferingId);
        if (exists)
            return Conflict(new { message = "Student already has an enrollment for this course offering." });

        var enrollment = new StudentCourseEnrollment
        {
            Id = Guid.NewGuid(),
            StudentId = studentId,
            CourseOfferingId = dto.CourseOfferingId,
            LinkedSemesterEnrollmentId = dto.LinkedSemesterEnrollmentId,
            EnrollmentSource = dto.EnrollmentSource.Trim(),
            Status = dto.Status.Trim(),
            EligibleForExam = dto.EligibleForExam,
            CreatedAt = DateTime.UtcNow,
            CreatedBy = GetCurrentUserId()!.Value
        };

        _context.StudentCourseEnrollments.Add(enrollment);
        await _context.SaveChangesAsync();
        return Ok(enrollment);
    }

    [HttpPut("student-course-enrollments/{id:guid}")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<IActionResult> UpdateStudentCourseEnrollment(Guid id, [FromBody] UpdateStudentCourseEnrollmentDto dto)
    {
        var enrollment = await _context.StudentCourseEnrollments
            .Include(x => x.CourseOffering)
            .FirstOrDefaultAsync(x => x.Id == id);

        if (enrollment == null)
            return NotFound();

        if (!AllowedStatuses.Contains(dto.Status.Trim()))
            return BadRequest(new { message = "Invalid student course enrollment status." });

        if (User.IsInRole("Professor"))
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var canManage = await _context.CourseOfferingStaffAssignments.AnyAsync(x =>
                x.CourseOfferingId == enrollment.CourseOfferingId &&
                x.UserId == userId.Value &&
                x.IsActive &&
                x.RoleInOffering == "Professor");

            if (!canManage)
                return Forbid();
        }

        enrollment.Status = dto.Status.Trim();
        enrollment.EligibleForExam = dto.EligibleForExam;
        await _context.SaveChangesAsync();
        return Ok(enrollment);
    }

    private async Task<string?> ValidateStudentCourseEnrollmentAsync(Guid studentId, Guid courseOfferingId, Guid? linkedSemesterEnrollmentId, string source, string status)
    {
        if (!await _context.Users.AnyAsync(x => x.Id == studentId && x.Role == "Student" && x.IsActive))
            return "StudentId must reference an active student.";
        if (!await _context.CourseOfferings.AnyAsync(x => x.Id == courseOfferingId))
            return "CourseOfferingId is invalid.";
        if (linkedSemesterEnrollmentId.HasValue && !await _context.SemesterEnrollments.AnyAsync(x => x.Id == linkedSemesterEnrollmentId.Value && x.StudentId == studentId))
            return "LinkedSemesterEnrollmentId is invalid for this student.";
        if (!AllowedSources.Contains(source.Trim()))
            return "Invalid enrollment source.";
        if (!AllowedStatuses.Contains(status.Trim()))
            return "Invalid enrollment status.";

        return null;
    }

    private Guid? GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userId, out var parsed) ? parsed : null;
    }
}
