using System;
using System.Collections.Generic;

namespace OnlineExam.Api.DTOs
{
    public class CreateExamAttemptDto
    {
        public Guid ExamId { get; set; }
        public List<AnswerDto> Answers { get; set; } = new();
    }

    public class AnswerDto
    {
        public Guid QuestionId { get; set; }
        public string Response { get; set; } = null!;
    }
}
