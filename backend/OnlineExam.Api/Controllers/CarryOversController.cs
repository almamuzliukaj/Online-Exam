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
public class CarryOversController : ControllerBase
{
    private static readonly HashSet<string> AllowedReasons = ["Failed", "Absent", "Deferred", "NotCompleted"];
    private readonly AppDbContext _context;

    public CarryOversController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("students/{studentId:guid}/carry-overs")]
    public async Task<IActionResult> GetCarryOvers(Guid studentId)
    {
        if (!User.IsInRole("Admin") && GetCurrentUserId() != studentId)
            return Forbid();

        var carryOvers = await _context.CarryOverCourses
            .Include(x => x.Course)
            .Include(x => x.OriginTerm)
            .Where(x => x.StudentId == studentId)
            .OrderByDescending(x => x.CreatedAt)
            .ToListAsync();

        return Ok(carryOvers);
    }

    [HttpPost("students/{studentId:guid}/carry-overs")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCarryOver(Guid studentId, [FromBody] CreateCarryOverCourseDto dto)
    {
        var validationError = await ValidateCarryOverAsync(studentId, dto.CourseId, dto.OriginTermId, dto.OriginSemesterNo, dto.Reason);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        var duplicateOpenCarryOver = await _context.CarryOverCourses.AnyAsync(x =>
            x.StudentId == studentId &&
            x.CourseId == dto.CourseId &&
            x.Status == "Open");

        if (duplicateOpenCarryOver)
            return Conflict(new { message = "Student already has an open carry-over for this course." });

        var carryOver = new CarryOverCourse
        {
            Id = Guid.NewGuid(),
            StudentId = studentId,
            CourseId = dto.CourseId,
            OriginTermId = dto.OriginTermId,
            OriginSemesterNo = dto.OriginSemesterNo,
            Reason = dto.Reason.Trim(),
            Status = "Open",
            CreatedAt = DateTime.UtcNow
        };

        _context.CarryOverCourses.Add(carryOver);
        await _context.SaveChangesAsync();
        return Ok(carryOver);
    }

    [HttpPost("carry-overs/{id:guid}/assign-offering")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<IActionResult> AssignOffering(Guid id, [FromBody] AssignCarryOverOfferingDto dto)
    {
        var carryOver = await _context.CarryOverCourses
            .FirstOrDefaultAsync(x => x.Id == id);

        if (carryOver == null)
            return NotFound();

        var offering = await _context.CourseOfferings
            .Include(x => x.Course)
            .FirstOrDefaultAsync(x => x.Id == dto.CourseOfferingId);

        if (offering == null)
            return BadRequest(new { message = "CourseOfferingId is invalid." });

        if (offering.CourseId != carryOver.CourseId)
            return BadRequest(new { message = "Carry-over course must be assigned to an offering of the same course." });

        if (User.IsInRole("Professor"))
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var canManage = await _context.CourseOfferingStaffAssignments.AnyAsync(x =>
                x.CourseOfferingId == dto.CourseOfferingId &&
                x.UserId == userId.Value &&
                x.IsActive &&
                x.RoleInOffering == "Professor");

            if (!canManage)
                return Forbid();
        }

        var existingEnrollment = await _context.StudentCourseEnrollments
            .FirstOrDefaultAsync(x => x.StudentId == carryOver.StudentId && x.CourseOfferingId == dto.CourseOfferingId);

        if (existingEnrollment == null)
        {
            existingEnrollment = new StudentCourseEnrollment
            {
                Id = Guid.NewGuid(),
                StudentId = carryOver.StudentId,
                CourseOfferingId = dto.CourseOfferingId,
                EnrollmentSource = "CarryOver",
                Status = "Eligible",
                EligibleForExam = true,
                CreatedAt = DateTime.UtcNow,
                CreatedBy = GetCurrentUserId()!.Value
            };

            _context.StudentCourseEnrollments.Add(existingEnrollment);
        }
        else
        {
            existingEnrollment.Status = "Eligible";
            existingEnrollment.EligibleForExam = true;
        }

        carryOver.Status = "AssignedToTerm";
        await _context.SaveChangesAsync();
        return Ok(new { carryOver, enrollment = existingEnrollment });
    }

    [HttpPost("carry-overs/{id:guid}/close")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<IActionResult> CloseCarryOver(Guid id, [FromBody] AssignCarryOverOfferingDto? dto = null)
    {
        var carryOver = await _context.CarryOverCourses.FindAsync(id);
        if (carryOver == null)
            return NotFound();

        carryOver.Status = "Closed";
        carryOver.ClosedAt = DateTime.UtcNow;
        if (dto?.CourseOfferingId != Guid.Empty)
            carryOver.ResolvedByPassingOfferingId = dto?.CourseOfferingId;

        await _context.SaveChangesAsync();
        return Ok(carryOver);
    }

    [HttpPost("carry-overs/{id:guid}/cancel")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CancelCarryOver(Guid id)
    {
        var carryOver = await _context.CarryOverCourses.FindAsync(id);
        if (carryOver == null)
            return NotFound();

        carryOver.Status = "Cancelled";
        carryOver.ClosedAt = DateTime.UtcNow;
        await _context.SaveChangesAsync();
        return Ok(carryOver);
    }

    private async Task<string?> ValidateCarryOverAsync(Guid studentId, Guid courseId, Guid originTermId, int originSemesterNo, string reason)
    {
        if (!await _context.Users.AnyAsync(x => x.Id == studentId && x.Role == "Student" && x.IsActive))
            return "StudentId must reference an active student.";
        if (!await _context.Courses.AnyAsync(x => x.Id == courseId))
            return "CourseId is invalid.";
        if (!await _context.Terms.AnyAsync(x => x.Id == originTermId))
            return "OriginTermId is invalid.";
        if (originSemesterNo < 1 || originSemesterNo > 6)
            return "OriginSemesterNo must be between 1 and 6.";
        if (!AllowedReasons.Contains(reason.Trim()))
            return "Invalid carry-over reason.";

        return null;
    }

    private Guid? GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userId, out var parsed) ? parsed : null;
    }
}
