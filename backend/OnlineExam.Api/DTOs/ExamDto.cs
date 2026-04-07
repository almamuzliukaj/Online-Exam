using System;
using System.Collections.Generic;

namespace OnlineExam.Api.DTOs
{
    public class ExamDto
    {
        public Guid Id { get; set; }
        public string Title { get; set; } = null!;
        public string Description { get; set; } = null!;
        public Guid OwnerId { get; set; }
        public DateTime CreatedAt { get; set; }
        public List<QuestionDto> Questions { get; set; } = new();
    }

    public class QuestionDto
    {
        public Guid Id { get; set; }
        public string Text { get; set; } = null!;
    }
}