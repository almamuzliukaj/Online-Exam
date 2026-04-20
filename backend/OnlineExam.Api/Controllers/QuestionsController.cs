using System.Security.Claims;
using System.Text.Json;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using OnlineExam.Api.Data;
using OnlineExam.Api.DTOs;
using OnlineExam.Api.Models;

namespace OnlineExam.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class QuestionsController : ControllerBase
{
    private static readonly HashSet<string> AllowedTypes = ["MCQ", "Text", "CSharp", "SQL", "Code"];
    private static readonly HashSet<string> AllowedDifficulties = ["Easy", "Medium", "Hard"];
    private static readonly HashSet<string> AllowedLanguages = ["CSharp", "SQL"];
    private readonly AppDbContext _context;

    public QuestionsController(AppDbContext context)
    {
        _context = context;
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> Get(Guid id)
    {
        var question = await _context.Questions.FindAsync(id);
        if (question == null)
            return NotFound();

        return Ok(ToQuestionResponse(question));
    }

    [HttpPost("/api/exams/{examId}/questions")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<IActionResult> Post(Guid examId, [FromBody] CreateQuestionDto dto)
    {
        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);
        var exam = await _context.Exams.FindAsync(examId);
        if (exam == null)
            return NotFound("Exam not found");
        if (role == "Professor" && exam.CreatedByUserId.ToString() != userId)
            return Forbid();

        var validationError = ValidateQuestion(dto);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        var normalizedType = NormalizeType(dto.Type);
        var testCases = NormalizeTestCases(dto.TestCases, normalizedType);

        var question = new Question
        {
            Id = Guid.NewGuid(),
            Text = dto.Text.Trim(),
            Type = normalizedType,
            CourseId = dto.CourseId,
            Difficulty = NormalizeText(dto.Difficulty),
            CorrectAnswer = NormalizeText(dto.CorrectAnswer),
            AnswerLanguage = ResolveAnswerLanguage(normalizedType, dto.AnswerLanguage),
            StarterCode = NormalizeText(dto.StarterCode),
            TestCasesJson = testCases.Count > 0 ? JsonSerializer.Serialize(testCases) : null,
            Points = dto.Points,
            ExamId = examId
        };

        _context.Questions.Add(question);
        await _context.SaveChangesAsync();

        return CreatedAtAction(nameof(Get), new { id = question.Id }, ToQuestionResponse(question));
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<IActionResult> Put(Guid id, [FromBody] CreateQuestionDto dto)
    {
        var existing = await _context.Questions.FindAsync(id);
        if (existing == null)
            return NotFound();

        var exam = await _context.Exams.FindAsync(existing.ExamId);
        if (exam == null)
            return NotFound("Exam not found");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);
        if (role == "Professor" && exam.CreatedByUserId.ToString() != userId)
            return Forbid();

        var validationError = ValidateQuestion(dto);
        if (validationError != null)
            return BadRequest(new { message = validationError });

        var normalizedType = NormalizeType(dto.Type);
        var testCases = NormalizeTestCases(dto.TestCases, normalizedType);

        existing.Text = dto.Text.Trim();
        existing.Type = normalizedType;
        existing.CourseId = dto.CourseId;
        existing.Difficulty = NormalizeText(dto.Difficulty);
        existing.CorrectAnswer = NormalizeText(dto.CorrectAnswer);
        existing.AnswerLanguage = ResolveAnswerLanguage(normalizedType, dto.AnswerLanguage);
        existing.StarterCode = NormalizeText(dto.StarterCode);
        existing.TestCasesJson = testCases.Count > 0 ? JsonSerializer.Serialize(testCases) : null;
        existing.Points = dto.Points;

        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin,Professor")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var existing = await _context.Questions.FindAsync(id);
        if (existing == null)
            return NotFound();

        var exam = await _context.Exams.FindAsync(existing.ExamId);
        if (exam == null)
            return NotFound("Exam not found");

        var userId = User.FindFirstValue(ClaimTypes.NameIdentifier);
        var role = User.FindFirstValue(ClaimTypes.Role);
        if (role == "Professor" && exam.CreatedByUserId.ToString() != userId)
            return Forbid();

        _context.Questions.Remove(existing);
        await _context.SaveChangesAsync();
        return NoContent();
    }

    [HttpGet("/api/exams/{examId}/questions")]
    public async Task<IActionResult> GetByExam(Guid examId)
    {
        var questions = await _context.Questions
            .Where(q => q.ExamId == examId)
            .ToListAsync();

        return Ok(questions.Select(ToQuestionResponse));
    }

    private static string? ValidateQuestion(CreateQuestionDto dto)
    {
        if (string.IsNullOrWhiteSpace(dto.Text))
            return "Question text is required.";
        if (string.IsNullOrWhiteSpace(dto.Type) || !AllowedTypes.Contains(dto.Type.Trim()))
            return "Invalid question type.";
        if (dto.Points <= 0)
            return "Points must be greater than zero.";
        if (!string.IsNullOrWhiteSpace(dto.Difficulty) && !AllowedDifficulties.Contains(dto.Difficulty.Trim()))
            return "Difficulty must be Easy, Medium, or Hard.";

        var normalizedType = NormalizeType(dto.Type);
        if (normalizedType == "CSharp" || normalizedType == "SQL")
        {
            if (!string.IsNullOrWhiteSpace(dto.AnswerLanguage) && !AllowedLanguages.Contains(dto.AnswerLanguage.Trim()))
                return "Only CSharp and SQL are supported languages.";
            if (ResolveAnswerLanguage(normalizedType, dto.AnswerLanguage) != normalizedType)
                return $"Question type {normalizedType} must use language {normalizedType}.";
            if (dto.TestCases == null || dto.TestCases.Count == 0)
                return $"{normalizedType} questions require at least one test case.";
            if (dto.TestCases.Any(x => string.IsNullOrWhiteSpace(x.ExpectedOutput)))
                return "Each test case must include an expected output.";
            if (dto.TestCases.Any(x => x.Weight <= 0))
                return "Each test case weight must be greater than zero.";
        }
        else if (!string.IsNullOrWhiteSpace(dto.AnswerLanguage))
        {
            return "Answer language is only allowed for CSharp or SQL questions.";
        }

        return null;
    }

    private static string NormalizeType(string type)
    {
        var trimmed = type.Trim();
        return trimmed == "Code" ? "CSharp" : trimmed;
    }

    private static string? NormalizeText(string? value)
    {
        return string.IsNullOrWhiteSpace(value) ? null : value.Trim();
    }

    private static string? ResolveAnswerLanguage(string type, string? answerLanguage)
    {
        if (type == "CSharp" || type == "SQL")
            return type;

        return NormalizeText(answerLanguage);
    }

    private static List<QuestionTestCaseDto> NormalizeTestCases(List<QuestionTestCaseDto>? testCases, string type)
    {
        if (type != "CSharp" && type != "SQL")
            return new List<QuestionTestCaseDto>();

        return (testCases ?? new List<QuestionTestCaseDto>())
            .Select(testCase => new QuestionTestCaseDto
            {
                Input = testCase.Input?.Trim() ?? string.Empty,
                ExpectedOutput = testCase.ExpectedOutput?.Trim() ?? string.Empty,
                IsHidden = testCase.IsHidden,
                Weight = testCase.Weight <= 0 ? 1 : testCase.Weight
            })
            .ToList();
    }

    private static object ToQuestionResponse(Question question)
    {
        var testCases = string.IsNullOrWhiteSpace(question.TestCasesJson)
            ? new List<QuestionTestCaseDto>()
            : JsonSerializer.Deserialize<List<QuestionTestCaseDto>>(question.TestCasesJson) ?? new List<QuestionTestCaseDto>();

        return new
        {
            question.Id,
            question.ExamId,
            question.Type,
            question.Text,
            question.Points,
            question.Difficulty,
            question.CorrectAnswer,
            question.AnswerLanguage,
            question.StarterCode,
            testCases,
            testCaseCount = testCases.Count,
            hiddenTestCaseCount = testCases.Count(x => x.IsHidden),
            publicTestCaseCount = testCases.Count(x => !x.IsHidden),
        };
    }
}
