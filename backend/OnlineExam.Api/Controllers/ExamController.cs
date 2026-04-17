using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Data;
using OnlineExam.Api.DTOs;
using OnlineExam.Api.Models;
using System.Security.Claims;

namespace OnlineExam.Api.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
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
            return await _context.Exams.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<Exam>> GetExam(Guid id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null)
            {
                return NotFound();
            }

            return exam;
        }

        [HttpPost]
        [Authorize(Roles = "Admin,Professor")]
        public async Task<ActionResult<Exam>> PostExam([FromBody] CreateExamDto dto)
        {
            if (string.IsNullOrWhiteSpace(dto.Title))
            {
                return BadRequest("Title is required.");
            }

            var durationMinutes = dto.DurationMinutes > 0 ? dto.DurationMinutes : 60;
            var startsAt = dto.StartsAt?.ToUniversalTime() ?? DateTime.UtcNow;
            var endsAt = dto.EndsAt?.ToUniversalTime() ?? startsAt.AddMinutes(durationMinutes);

            if (endsAt <= startsAt)
            {
                return BadRequest("EndsAt must be later than StartsAt.");
            }

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;

            var exam = new Exam
            {
                Id = Guid.NewGuid(),
                Title = dto.Title.Trim(),
                Description = dto.Description?.Trim() ?? string.Empty,
                StartsAt = startsAt,
                EndsAt = endsAt,
                DurationMinutes = durationMinutes,
                CreatedByUserId = Guid.TryParse(userId, out var creatorId) ? creatorId : Guid.Empty,
                CreatedAt = DateTime.UtcNow,
                IsPublished = false,
                Status = "Draft"
            };

            _context.Exams.Add(exam);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExam), new { id = exam.Id }, exam);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutExam(Guid id, Exam exam)
        {
            if (id != exam.Id)
            {
                return BadRequest();
            }

            _context.Entry(exam).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExamExists(id))
                {
                    return NotFound();
                }

                throw;
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExam(Guid id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null)
            {
                return NotFound();
            }

            _context.Exams.Remove(exam);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExamExists(Guid id)
        {
            return _context.Exams.Any(e => e.Id == id);
        }

        [HttpPost("{examId}/attempt")]
        [Authorize(Roles = "Student")]
        public async Task<IActionResult> SubmitAttempt(Guid examId, [FromBody] CreateExamAttemptDto dto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userId == null)
            {
                return Unauthorized();
            }

            if (dto.ExamId != Guid.Empty && dto.ExamId != examId)
            {
                return BadRequest("ExamId in body does not match route.");
            }

            var exam = await _context.Exams
                .Include(e => e.Questions)
                .FirstOrDefaultAsync(e => e.Id == examId);

            if (exam == null)
            {
                return NotFound("Exam not found");
            }

            var details = new List<QuestionScoreDetailDto>();
            double score = 0;

            foreach (var ans in dto.Answers)
            {
                var q = exam.Questions.FirstOrDefault(x => x.Id == ans.QuestionId);
                if (q == null)
                {
                    continue;
                }

                var awarded = 0d;
                if (string.Equals(q.Type, "MCQ", StringComparison.OrdinalIgnoreCase) &&
                    !string.IsNullOrWhiteSpace(q.CorrectAnswer) &&
                    string.Equals(q.CorrectAnswer.Trim(), ans.Response.Trim(), StringComparison.OrdinalIgnoreCase))
                {
                    awarded = q.Points;
                }

                details.Add(new QuestionScoreDetailDto
                {
                    QuestionId = q.Id,
                    PointsAwarded = awarded,
                    MaxPoints = q.Points
                });

                score += awarded;
            }

            var attempt = new ExamAttempt
            {
                Id = Guid.NewGuid(),
                ExamId = examId,
                StudentId = Guid.Parse(userId),
                SubmittedAt = DateTime.UtcNow,
                AnswersJson = System.Text.Json.JsonSerializer.Serialize(dto.Answers),
                Score = score
            };

            _context.ExamAttempts.Add(attempt);
            await _context.SaveChangesAsync();

            return Ok(new ExamAttemptResultDto
            {
                ExamAttemptId = attempt.Id,
                Score = attempt.Score,
                Questions = details
            });
        }

        [HttpPost("{id}/publish")]
        [Authorize(Roles = "Admin,Professor")]
        public async Task<IActionResult> PublishExam(Guid id)
        {
            var exam = await _context.Exams.FindAsync(id);
            if (exam == null)
            {
                return NotFound();
            }

            exam.Status = "Published";
            exam.IsPublished = true;
            await _context.SaveChangesAsync();

            return Ok(new { message = "Exam published!", examId = id });
        }

        [HttpGet("{id}/gradebook")]
        [Authorize(Roles = "Admin,Professor")]
        public async Task<IActionResult> GetGradebook(Guid id)
        {
            var attempts = await _context.ExamAttempts
                .Where(a => a.ExamId == id)
                .Select(a => new
                {
                    a.Id,
                    a.StudentId,
                    a.Score,
                    a.SubmittedAt
                })
                .ToListAsync();

            return Ok(attempts);
        }

        [HttpPost("build-random")]
        [Authorize(Roles = "Admin,Professor")]
        public async Task<IActionResult> BuildRandomExam([FromBody] BuildExamParamsDto dto)
        {
            if (dto.NumberOfQuestions <= 0)
            {
                return BadRequest("NumberOfQuestions must be greater than 0.");
            }

            var query = _context.Questions.AsQueryable();

            if (dto.CourseId != Guid.Empty)
            {
                query = query.Where(q => q.CourseId == dto.CourseId);
            }

            if (!string.IsNullOrWhiteSpace(dto.Difficulty))
            {
                query = query.Where(q => q.Difficulty != null &&
                    q.Difficulty.ToLower() == dto.Difficulty.ToLower());
            }

            if (!string.IsNullOrWhiteSpace(dto.Type))
            {
                query = query.Where(q => q.Type.ToLower() == dto.Type.ToLower());
            }

            var random = await query
                .OrderBy(_ => Guid.NewGuid())
                .Take(dto.NumberOfQuestions)
                .Select(q => new { q.Id, q.Text, q.Points, q.Type })
                .ToListAsync();

            return Ok(random);
        }
    }
}
