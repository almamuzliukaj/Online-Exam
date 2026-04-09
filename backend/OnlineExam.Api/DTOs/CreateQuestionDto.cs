namespace OnlineExam.Api.DTOs
{
    public class CreateQuestionDto
    {
        public string Text { get; set; } = null!;
        public string Type { get; set; } = null!;
        public int Points { get; set; }
    }
}