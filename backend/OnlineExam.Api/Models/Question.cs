using System;

namespace OnlineExam.Api.Models
{
    public class Question
    {
        public Guid Id { get; set; }                   // PRIMARY KEY, required!
        public string Text { get; set; } = null!;
        public Guid ExamId { get; set; }
        public Exam Exam { get; set; } = null!;
    }
}