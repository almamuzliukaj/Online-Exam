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
public class CoursesController : ControllerBase
{
    private readonly AppDbContext _context;

    public CoursesController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet]
    public async Task<IActionResult> GetCourses()
    {
        IQueryable<Course> query = _context.Courses;
        if (!User.IsInRole("Admin"))
            query = query.Where(x => x.IsActive);

        var courses = await query
            .OrderBy(x => x.YearOfStudy)
            .ThenBy(x => x.DefaultSemesterNo)
            .ThenBy(x => x.Code)
            .ToListAsync();

        return Ok(courses);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetCourse(Guid id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
            return NotFound();

        if (!User.IsInRole("Admin") && !course.IsActive)
            return Forbid();

        return Ok(course);
    }

    [HttpPost]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> CreateCourse([FromBody] CreateCourseDto dto)
    {
        var validationError = ValidateCourse(dto.Code, dto.Name, dto.Credits, dto.YearOfStudy, dto.DefaultSemesterNo);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        var code = dto.Code.Trim().ToUpperInvariant();
        if (await _context.Courses.AnyAsync(x => x.Code == code))
            return Conflict(new { message = "Course code already exists." });

        var course = new Course
        {
            Id = Guid.NewGuid(),
            Code = code,
            Name = dto.Name.Trim(),
            Credits = dto.Credits,
            YearOfStudy = dto.YearOfStudy,
            DefaultSemesterNo = dto.DefaultSemesterNo,
            IsElective = dto.IsElective,
            IsActive = true,
            Description = dto.Description.Trim()
        };

        _context.Courses.Add(course);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(GetCourse), new { id = course.Id }, course);
    }

    [HttpPut("{id:guid}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> UpdateCourse(Guid id, [FromBody] UpdateCourseDto dto)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
            return NotFound();

        var validationError = ValidateCourse(dto.Code, dto.Name, dto.Credits, dto.YearOfStudy, dto.DefaultSemesterNo);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        var code = dto.Code.Trim().ToUpperInvariant();
        if (await _context.Courses.AnyAsync(x => x.Id != id && x.Code == code))
            return Conflict(new { message = "Course code already exists." });

        course.Code = code;
        course.Name = dto.Name.Trim();
        course.Credits = dto.Credits;
        course.YearOfStudy = dto.YearOfStudy;
        course.DefaultSemesterNo = dto.DefaultSemesterNo;
        course.IsElective = dto.IsElective;
        course.IsActive = dto.IsActive;
        course.Description = dto.Description.Trim();

        await _context.SaveChangesAsync();
        return Ok(course);
    }

    [HttpPost("{id:guid}/deactivate")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Deactivate(Guid id)
    {
        var course = await _context.Courses.FindAsync(id);
        if (course == null)
            return NotFound();

        course.IsActive = false;
        await _context.SaveChangesAsync();
        return Ok(course);
    }

    private static string? ValidateCourse(string code, string name, int credits, int yearOfStudy, int semesterNo)
    {
        if (string.IsNullOrWhiteSpace(code))
            return "Code is required.";
        if (string.IsNullOrWhiteSpace(name))
            return "Name is required.";
        if (credits <= 0)
            return "Credits must be greater than zero.";
        if (!IsValidYearSemesterPair(yearOfStudy, semesterNo))
            return "YearOfStudy and DefaultSemesterNo are not a valid pair.";

        return null;
    }

    private static bool IsValidYearSemesterPair(int yearOfStudy, int semesterNo)
    {
        if (yearOfStudy < 1)
            return false;

        return semesterNo >= 1;
    }
}
