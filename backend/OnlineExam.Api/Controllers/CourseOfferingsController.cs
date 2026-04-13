using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;
using OnlineExam.Api.Models;
using OnlineExam.Api.DTOs;
using OnlineExam.Api.Data;

namespace OnlineExam.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class CourseOfferingsController : ControllerBase
    {
        private readonly AppDbContext _context;
        public CourseOfferingsController(AppDbContext context) => _context = context;

        [HttpGet]
        [Authorize(Roles = "Admin")]
        public IActionResult GetOfferings()
        {
            var offerings = _context.CourseOfferings
                .Include(o => o.Course)
                .Include(o => o.Term)
                .ToList();
            return Ok(offerings);
        }

        [HttpPost]
        [Authorize(Roles = "Admin")]
        public IActionResult CreateOffering([FromBody] CreateCourseOfferingDto dto)
        {
            if (dto.ProfessorId == Guid.Empty)
                return BadRequest("ProfessorId is required.");

            var offering = new CourseOffering
            {
                Id = Guid.NewGuid(),
                CourseId = dto.CourseId,
                TermId = dto.TermId,
                YearOfStudy = dto.YearOfStudy,
                SemesterNo = dto.SemesterNo,
                ProfessorId = dto.ProfessorId,
                AssistantId = dto.AssistantId
            };

            _context.CourseOfferings.Add(offering);
            _context.SaveChanges();

            var created = _context.CourseOfferings
                .Include(x => x.Course)
                .Include(x => x.Term)
                .First(x => x.Id == offering.Id);

            return CreatedAtAction(nameof(GetOfferings), new { id = offering.Id }, created);
        }

        [HttpGet("mine")]
        [Authorize(Roles = "Professor,Assistant")]
        public IActionResult GetMyOfferings()
        {
            var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
            if (userId == null) return Unauthorized();
            var userGuid = Guid.Parse(userId);

            var offerings = _context.CourseOfferings
                .Include(o => o.Course)
                .Include(o => o.Term)
                .Where(o => o.ProfessorId == userGuid || o.AssistantId == userGuid)
                .ToList();

            return Ok(offerings);
        }
    }
}