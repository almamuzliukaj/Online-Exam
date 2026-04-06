public class Exam
{
    public Guid Id { get; set; }
    public string Title { get; set; } = null!;
    public string Description { get; set; } = null!;
    public DateTime StartsAt { get; set; }
    public DateTime EndsAt { get; set; }
    public int DurationMinutes { get; set; }
    public Guid CreatedByUserId { get; set; }
    public DateTime CreatedAt { get; set; }
    public bool IsPublished { get; set; }

    // Navigation property for EF Core
    public List<Question> Questions { get; set; } = new();
}

public class Question
{
    public Guid Id { get; set; }
    public string Text { get; set; } = null!;
    public Guid ExamId { get; set; }

    // Navigation property for EF Core
    public Exam Exam { get; set; } = null!;
}