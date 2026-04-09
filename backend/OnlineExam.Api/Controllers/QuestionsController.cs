using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Models;
using OnlineExam.Api.Data;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using OnlineExam.Api.DTOs; // Shto këtë

namespace OnlineExam.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class QuestionsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public QuestionsController(AppDbContext context)
        {
            _context = context;
        }

        // GET: /api/questions/{id}
        [HttpGet("{id}")]
        public async Task<ActionResult<Question>> Get(Guid id)
        {
            var question = await _context.Questions.FindAsync(id);
            if (question == null)
                return NotFound();

            return question;
        }

        // POST: /api/exams/{examId}/questions
        [HttpPost("/api/exams/{examId}/questions")]
        [Authorize(Roles = "Admin,Professor")]
        public async Task<ActionResult<Question>> Post(Guid examId, [FromBody] CreateQuestionDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            var exam = await _context.Exams.FindAsync(examId);
            if (exam == null) return NotFound("Exam not found");
            if (role == "Professor" && exam.CreatedByUserId.ToString() != userId)
                return Forbid();

            var question = new Question
            {
                Id = Guid.NewGuid(),
                Text = dto.Text,
                ExamId = examId
            };
            _context.Questions.Add(question);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(Get), new { id = question.Id }, question);
        }

        // PUT: /api/questions/{id}
        [HttpPut("{id}")]
        [Authorize(Roles = "Admin,Professor")]
        public async Task<IActionResult> Put(Guid id, [FromBody] CreateQuestionDto dto)
        {
            var existing = await _context.Questions.FindAsync(id);
            if (existing == null) return NotFound();

            var exam = await _context.Exams.FindAsync(existing.ExamId);
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role == "Professor" && exam.CreatedByUserId.ToString() != userId)
                return Forbid();

            existing.Text = dto.Text;
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // DELETE: /api/questions/{id}
        [HttpDelete("{id}")]
        [Authorize(Roles = "Admin,Professor")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var existing = await _context.Questions.FindAsync(id);
            if (existing == null) return NotFound();

            var exam = await _context.Exams.FindAsync(existing.ExamId);
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            var role = User.FindFirst(ClaimTypes.Role)?.Value;
            if (role == "Professor" && exam.CreatedByUserId.ToString() != userId)
                return Forbid();

            _context.Questions.Remove(existing);
            await _context.SaveChangesAsync();
            return NoContent();
        }

        // GET: /api/exams/{examId}/questions
        [HttpGet("/api/exams/{examId}/questions")]
        public async Task<ActionResult<IEnumerable<Question>>> GetByExam(Guid examId)
        {
            var exam = await _context.Exams.Include(x => x.Questions).FirstOrDefaultAsync(x => x.Id == examId);
            if (exam == null) return NotFound();

            return Ok(exam.Questions);
        }
    }
}