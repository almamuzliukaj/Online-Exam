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
public class SemesterEnrollmentsController : ControllerBase
{
    private static readonly HashSet<string> AllowedStatuses = ["Pending", "Active", "Frozen", "Completed", "Withdrawn"];
    private readonly AppDbContext _context;

    public SemesterEnrollmentsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("semester-enrollments")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> GetSemesterEnrollments()
    {
        var enrollments = await _context.SemesterEnrollments
            .Include(x => x.Term)
            .OrderByDescending(x => x.EnrolledAt)
            .ToListAsync();

        return Ok(enrollments);
    }

    [HttpGet("students/{studentId:guid}/semester-enrollments")]
    public async Task<IActionResult> GetStudentSemesterEnrollments(Guid studentId)
    {
        if (!User.IsInRole("Admin") && GetCurrentUserId() != studentId)
            return Forbid();

        var isStudent = await _context.Users.AnyAsync(x => x.Id == studentId && x.Role == "Student");
        if (!isStudent)
            return NotFound(new { message = "Student not found." });

        var enrollments = await _context.SemesterEnrollments
            .Include(x => x.Term)
            .Where(x => x.StudentId == studentId)
            .OrderByDescending(x => x.EnrolledAt)
            .ToListAsync();

        return Ok(enrollments);
    }

    [HttpPost("students/{studentId:guid}/semester-enrollments")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateSemesterEnrollment(Guid studentId, [FromBody] CreateSemesterEnrollmentDto dto)
    {
        var validationError = await ValidateSemesterEnrollmentAsync(studentId, dto.TermId, dto.YearOfStudy, dto.SemesterNo, dto.Status);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        var hasActiveOverlap = await _context.SemesterEnrollments.AnyAsync(x =>
            x.StudentId == studentId &&
            x.TermId == dto.TermId &&
            x.Status == "Active");

        if (hasActiveOverlap && dto.Status == "Active")
            return Conflict(new { message = "Student already has an active semester enrollment for this term." });

        var enrollment = new SemesterEnrollment
        {
            Id = Guid.NewGuid(),
            StudentId = studentId,
            TermId = dto.TermId,
            YearOfStudy = dto.YearOfStudy,
            SemesterNo = dto.SemesterNo,
            Status = dto.Status.Trim(),
            EnrolledAt = DateTime.UtcNow,
            ApprovedBy = GetCurrentUserId(),
            Notes = dto.Notes.Trim()
        };

        _context.SemesterEnrollments.Add(enrollment);
        await _context.SaveChangesAsync();

        return Ok(enrollment);
    }

    [HttpPut("semester-enrollments/{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateSemesterEnrollment(Guid id, [FromBody] UpdateSemesterEnrollmentDto dto)
    {
        var enrollment = await _context.SemesterEnrollments.FindAsync(id);
        if (enrollment == null)
            return NotFound();

        var validationError = await ValidateSemesterEnrollmentAsync(enrollment.StudentId, enrollment.TermId, dto.YearOfStudy, dto.SemesterNo, dto.Status, id);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        enrollment.YearOfStudy = dto.YearOfStudy;
        enrollment.SemesterNo = dto.SemesterNo;
        enrollment.Status = dto.Status.Trim();
        enrollment.Notes = dto.Notes.Trim();
        if (enrollment.ApprovedBy == null && dto.Status == "Active")
            enrollment.ApprovedBy = GetCurrentUserId();

        await _context.SaveChangesAsync();
        return Ok(enrollment);
    }

    [HttpPost("semester-enrollments/{id:guid}/activate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> ActivateSemesterEnrollment(Guid id)
    {
        var enrollment = await _context.SemesterEnrollments.FindAsync(id);
        if (enrollment == null)
            return NotFound();

        var hasOtherActive = await _context.SemesterEnrollments.AnyAsync(x =>
            x.Id != id &&
            x.StudentId == enrollment.StudentId &&
            x.TermId == enrollment.TermId &&
            x.Status == "Active");

        if (hasOtherActive)
            return Conflict(new { message = "Student already has another active semester enrollment for this term." });

        enrollment.Status = "Active";
        enrollment.ApprovedBy = GetCurrentUserId();
        await _context.SaveChangesAsync();
        return Ok(enrollment);
    }

    [HttpPost("semester-enrollments/{id:guid}/withdraw")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> WithdrawSemesterEnrollment(Guid id)
    {
        var enrollment = await _context.SemesterEnrollments.FindAsync(id);
        if (enrollment == null)
            return NotFound();

        enrollment.Status = "Withdrawn";

        var relatedCourseEnrollments = await _context.StudentCourseEnrollments
            .Where(x => x.LinkedSemesterEnrollmentId == id)
            .ToListAsync();

        foreach (var courseEnrollment in relatedCourseEnrollments)
        {
            courseEnrollment.Status = "Withdrawn";
            courseEnrollment.EligibleForExam = false;
        }

        await _context.SaveChangesAsync();
        return Ok(enrollment);
    }

    private async Task<string?> ValidateSemesterEnrollmentAsync(Guid studentId, Guid termId, int yearOfStudy, int semesterNo, string status, Guid? enrollmentId = null)
    {
        if (!await _context.Users.AnyAsync(x => x.Id == studentId && x.Role == "Student" && x.IsActive))
            return "StudentId must reference an active student.";
        if (!await _context.Terms.AnyAsync(x => x.Id == termId))
            return "TermId is invalid.";
        if (!IsValidYearSemesterPair(yearOfStudy, semesterNo))
            return "YearOfStudy and SemesterNo are not a valid pair.";
        if (!AllowedStatuses.Contains(status.Trim()))
            return "Invalid semester enrollment status.";

        var duplicateActive = status.Trim() == "Active" && await _context.SemesterEnrollments.AnyAsync(x =>
            x.Id != enrollmentId &&
            x.StudentId == studentId &&
            x.TermId == termId &&
            x.Status == "Active");

        if (duplicateActive)
            return "Student already has an active semester enrollment for the term.";

        return null;
    }

    private Guid? GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userId, out var parsed) ? parsed : null;
    }

    private static bool IsValidYearSemesterPair(int yearOfStudy, int semesterNo)
    {
        if (yearOfStudy < 1 || yearOfStudy > 3)
            return false;

        return semesterNo == ((yearOfStudy * 2) - 1) || semesterNo == (yearOfStudy * 2);
    }
}
