using System;

namespace OnlineExam.Api.DTOs
{
    public class QuestionDetailsDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = null!;
        public Guid ExamId { get; set; }
    }
}