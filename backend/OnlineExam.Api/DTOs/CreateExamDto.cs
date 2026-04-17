namespace OnlineExam.Api.DTOs
{
    public class CreateExamDto {
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public int DurationMinutes { get; set; } = 60;
        public DateTime? StartsAt { get; set; }
        public DateTime? EndsAt { get; set; }
    }
}
