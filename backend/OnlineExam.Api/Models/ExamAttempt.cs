namespace OnlineExam.Api.Models;

public class ExamAttempt
{
    public Guid Id { get; set; }
    public Guid ExamId { get; set; }
    public Guid StudentId { get; set; }
    public DateTime SubmittedAt { get; set; }
    public string AnswersJson { get; set; } = null!;
    public double Score { get; set; }

    public Exam Exam { get; set; } = null!;
}
