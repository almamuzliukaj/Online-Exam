namespace OnlineExam.Api.Models;

public class Question
{
    public Guid Id { get; set; }
    public Guid ExamId { get; set; }
    public string Type { get; set; } = null!;
    public string Text { get; set; } = null!;
    public int Points { get; set; }
    public Exam Exam { get; set; } = null!;
}