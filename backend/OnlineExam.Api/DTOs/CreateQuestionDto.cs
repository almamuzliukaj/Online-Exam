namespace OnlineExam.Api.DTOs
{
    public class CreateQuestionDto
    {
        public string Text { get; set; } = null!;
        public string Type { get; set; } = null!;
        public Guid? CourseId { get; set; }
        public string? Difficulty { get; set; }
        public string? CorrectAnswer { get; set; }
        public string? AnswerLanguage { get; set; }
        public string? StarterCode { get; set; }
        public List<QuestionTestCaseDto> TestCases { get; set; } = new();
        public int Points { get; set; }
    }

    public class QuestionTestCaseDto
    {
        public string Input { get; set; } = string.Empty;
        public string ExpectedOutput { get; set; } = string.Empty;
        public bool IsHidden { get; set; }
        public int Weight { get; set; } = 1;
    }
}
