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
public class TermsController : ControllerBase
{
    private static readonly HashSet<string> AllowedStatuses = ["Draft", "Open", "Active", "Closed", "Archived"];
    private readonly AppDbContext _context;

    public TermsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetTerms()
    {
        if (!User.IsInRole("Admin"))
        {
            var visibleTerms = await _context.Terms
                .Where(x => x.Status != "Draft")
                .OrderByDescending(x => x.StartDate)
                .ToListAsync();

            return Ok(visibleTerms);
        }

        var terms = await _context.Terms
            .OrderByDescending(x => x.StartDate)
            .ToListAsync();

        return Ok(terms);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetTerm(Guid id)
    {
        var term = await _context.Terms.FindAsync(id);
        if (term == null)
            return NotFound();

        if (!User.IsInRole("Admin") && term.Status == "Draft")
            return Forbid();

        return Ok(term);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateTerm([FromBody] CreateTermDto dto)
    {
        var validationError = ValidateTerm(dto.Code, dto.Name, dto.Season, dto.AcademicYearLabel, dto.StartDate, dto.EndDate, dto.EnrollmentOpenAt, dto.EnrollmentCloseAt);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        var code = dto.Code.Trim().ToUpperInvariant();
        if (await _context.Terms.AnyAsync(x => x.Code == code))
            return Conflict(new { message = "Term code already exists." });

        if (dto.IsCurrent)
            await ClearCurrentTermFlagAsync();

        var term = new Term
        {
            Id = Guid.NewGuid(),
            Code = code,
            Name = dto.Name.Trim(),
            Season = dto.Season.Trim(),
            AcademicYearLabel = dto.AcademicYearLabel.Trim(),
            StartDate = dto.StartDate,
            EndDate = dto.EndDate,
            EnrollmentOpenAt = dto.EnrollmentOpenAt,
            EnrollmentCloseAt = dto.EnrollmentCloseAt,
            Status = "Draft",
            IsCurrent = dto.IsCurrent
        };

        _context.Terms.Add(term);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetTerm), new { id = term.Id }, term);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateTerm(Guid id, [FromBody] UpdateTermDto dto)
    {
        var term = await _context.Terms.FindAsync(id);
        if (term == null)
            return NotFound();

        var validationError = ValidateTerm(dto.Code, dto.Name, dto.Season, dto.AcademicYearLabel, dto.StartDate, dto.EndDate, dto.EnrollmentOpenAt, dto.EnrollmentCloseAt);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        if (!AllowedStatuses.Contains(dto.Status))
            return BadRequest(new { message = "Invalid term status." });

        var code = dto.Code.Trim().ToUpperInvariant();
        if (await _context.Terms.AnyAsync(x => x.Id != id && x.Code == code))
            return Conflict(new { message = "Term code already exists." });

        if (dto.IsCurrent)
            await ClearCurrentTermFlagAsync(id);

        term.Code = code;
        term.Name = dto.Name.Trim();
        term.Season = dto.Season.Trim();
        term.AcademicYearLabel = dto.AcademicYearLabel.Trim();
        term.StartDate = dto.StartDate;
        term.EndDate = dto.EndDate;
        term.EnrollmentOpenAt = dto.EnrollmentOpenAt;
        term.EnrollmentCloseAt = dto.EnrollmentCloseAt;
        term.Status = dto.Status;
        term.IsCurrent = dto.IsCurrent;

        await _context.SaveChangesAsync();
        return Ok(term);
    }

    [HttpPost("{id:guid}/publish")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Publish(Guid id)
    {
        var term = await _context.Terms.FindAsync(id);
        if (term == null)
            return NotFound();

        term.Status = "Open";
        await _context.SaveChangesAsync();
        return Ok(term);
    }

    [HttpPost("{id:guid}/close")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Close(Guid id)
    {
        var term = await _context.Terms.FindAsync(id);
        if (term == null)
            return NotFound();

        var hasDraftOfferings = await _context.CourseOfferings.AnyAsync(x => x.TermId == id && x.Status == "Draft");
        if (hasDraftOfferings)
            return BadRequest(new { message = "Term cannot be closed while draft offerings exist." });

        var hasPendingEnrollments = await _context.SemesterEnrollments.AnyAsync(x => x.TermId == id && x.Status == "Pending");
        if (hasPendingEnrollments)
            return BadRequest(new { message = "Term cannot be closed while pending semester enrollments exist." });

        term.Status = "Closed";
        term.IsCurrent = false;
        await _context.SaveChangesAsync();
        return Ok(term);
    }

    private async Task ClearCurrentTermFlagAsync(Guid? excludedId = null)
    {
        var currentTerms = await _context.Terms
            .Where(x => x.IsCurrent && (!excludedId.HasValue || x.Id != excludedId.Value))
            .ToListAsync();

        foreach (var currentTerm in currentTerms)
            currentTerm.IsCurrent = false;
    }

    private static string? ValidateTerm(
        string code,
        string name,
        string season,
        string academicYearLabel,
        DateTime startDate,
        DateTime endDate,
        DateTime enrollmentOpenAt,
        DateTime enrollmentCloseAt)
    {
        if (string.IsNullOrWhiteSpace(code))
            return "Code is required.";
        if (string.IsNullOrWhiteSpace(name))
            return "Name is required.";
        if (string.IsNullOrWhiteSpace(season))
            return "Season is required.";
        if (string.IsNullOrWhiteSpace(academicYearLabel))
            return "Academic year label is required.";
        if (startDate >= endDate)
            return "StartDate must be earlier than EndDate.";
        if (enrollmentOpenAt > enrollmentCloseAt)
            return "EnrollmentOpenAt must be earlier than EnrollmentCloseAt.";
        if (enrollmentCloseAt.Date > endDate.Date)
            return "EnrollmentCloseAt must not be later than EndDate.";

        return null;
    }
}
