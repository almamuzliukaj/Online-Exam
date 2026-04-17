using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Data;
using OnlineExam.Api.DTOs;
using OnlineExam.Api.Models;

namespace OnlineExam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ExamsController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExamsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<Exam>>> GetExams()
    {
        IQueryable<Exam> query = _context.Exams.Include(x => x.CourseOffering);

        if (User.IsInRole("Professor") || User.IsInRole("Assistant"))
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            query = query.Where(x =>
                x.CreatedByUserId == userId.Value ||
                (x.CourseOfferingId != null && _context.CourseOfferingStaffAssignments.Any(a =>
                    a.CourseOfferingId == x.CourseOfferingId &&
                    a.UserId == userId.Value &&
                    a.IsActive)));
        }

        return await query.OrderByDescending(x => x.CreatedAt).ToListAsync();
    }

    [HttpGet("{id:guid}")]
    public async Task<ActionResult<Exam>> GetExam(Guid id)
    {
        var exam = await _context.Exams.Include(x => x.CourseOffering).FirstOrDefaultAsync(x => x.Id == id);
        if (exam == null)
            return NotFound();

        if (User.IsInRole("Professor") || User.IsInRole("Assistant"))
        {
            var userId = GetCurrentUserId();
            if (userId == null)
                return Unauthorized();

            var hasAccess = exam.CreatedByUserId == userId.Value ||
                            (exam.CourseOfferingId != null && await _context.CourseOfferingStaffAssignments.AnyAsync(a =>
                                a.CourseOfferingId == exam.CourseOfferingId &&
                                a.UserId == userId.Value &&
                                a.IsActive));

            if (!hasAccess)
                return Forbid();
        }

        return exam;
    }

    [HttpPost]
    [Authorize(Roles = "Admin,Professor,Assistant")]
    public async Task<ActionResult<Exam>> PostExam([FromBody] CreateExamDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest(new { message = "Title is required." });
        if (dto.StartsAt >= dto.EndsAt)
            return BadRequest(new { message = "StartsAt must be earlier than EndsAt." });
        if (dto.DurationMinutes <= 0)
            return BadRequest(new { message = "DurationMinutes must be greater than zero." });

        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        if (dto.CourseOfferingId.HasValue)
        {
            var offeringExists = await _context.CourseOfferings.AnyAsync(x => x.Id == dto.CourseOfferingId.Value);
            if (!offeringExists)
                return BadRequest(new { message = "CourseOfferingId is invalid." });

            if (!User.IsInRole("Admin"))
            {
                var hasAssignment = await _context.CourseOfferingStaffAssignments.AnyAsync(a =>
                    a.CourseOfferingId == dto.CourseOfferingId.Value &&
                    a.UserId == userId.Value &&
                    a.IsActive);

                if (!hasAssignment)
                    return Forbid();
            }
        }

        var exam = new Exam
        {
            Id = Guid.NewGuid(),
            Title = dto.Title.Trim(),
            Description = dto.Description.Trim(),
            StartsAt = dto.StartsAt,
            EndsAt = dto.EndsAt,
            DurationMinutes = dto.DurationMinutes,
            IsPublished = dto.IsPublished,
            CreatedByUserId = userId.Value,
            CreatedAt = DateTime.UtcNow,
            CourseOfferingId = dto.CourseOfferingId
        };

        _context.Exams.Add(exam);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetExam), new { id = exam.Id }, exam);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin,Professor,Assistant")]
    public async Task<IActionResult> PutExam(Guid id, [FromBody] CreateExamDto dto)
    {
        var exam = await _context.Exams.FindAsync(id);
        if (exam == null)
            return NotFound();

        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        if (!User.IsInRole("Admin") && exam.CreatedByUserId != userId.Value)
            return Forbid();

        if (string.IsNullOrWhiteSpace(dto.Title))
            return BadRequest(new { message = "Title is required." });
        if (dto.StartsAt >= dto.EndsAt)
            return BadRequest(new { message = "StartsAt must be earlier than EndsAt." });
        if (dto.DurationMinutes <= 0)
            return BadRequest(new { message = "DurationMinutes must be greater than zero." });

        exam.Title = dto.Title.Trim();
        exam.Description = dto.Description.Trim();
        exam.StartsAt = dto.StartsAt;
        exam.EndsAt = dto.EndsAt;
        exam.DurationMinutes = dto.DurationMinutes;
        exam.IsPublished = dto.IsPublished;
        exam.CourseOfferingId = dto.CourseOfferingId;

        await _context.SaveChangesAsync();
        return Ok(exam);
    }

    [HttpDelete("{id:guid}")]
    [Authorize(Roles = "Admin,Professor,Assistant")]
    public async Task<IActionResult> DeleteExam(Guid id)
    {
        var exam = await _context.Exams.FindAsync(id);
        if (exam == null)
            return NotFound();

        var userId = GetCurrentUserId();
        if (userId == null)
            return Unauthorized();

        if (!User.IsInRole("Admin") && exam.CreatedByUserId != userId.Value)
            return Forbid();

        _context.Exams.Remove(exam);
        await _context.SaveChangesAsync();

        return NoContent();
    }

    private Guid? GetCurrentUserId()
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        return Guid.TryParse(userId, out var parsed) ? parsed : null;
    }
}
